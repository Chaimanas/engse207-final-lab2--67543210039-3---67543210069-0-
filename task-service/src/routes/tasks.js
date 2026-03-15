const express       = require('express');
const { pool }      = require('../db/db');
const requireAuth   = require('../middleware/authMiddleware');

const router = express.Router();

// Helper สำหรับส่ง Log
async function logEvent({ level, event, userId, ip, method, path, statusCode, message, meta }) {
  try {
    await fetch('http://log-service:3003/api/logs/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'task-service', level, event, user_id: userId,
        ip_address: ip, method, path, status_code: statusCode, message, meta
      })
    });
  } catch (_) {}
}

// ใช้ Middleware ตรวจสอบ Token
router.use(requireAuth);

// GET /api/tasks/ — ดึงรายการ Task
router.get('/', async (req, res) => {
  try {
    let result;
    const userId = req.user.id || req.user.sub;

    if (req.user.role === 'admin') {
      result = await pool.query(`
        SELECT t.*, u.username 
        FROM tasks t 
        JOIN users u ON t.user_id = u.id 
        ORDER BY t.created_at DESC
      `);
    } else {
      result = await pool.query(`
        SELECT t.*, u.username 
        FROM tasks t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.user_id = $1 
        ORDER BY t.created_at DESC
      `, [userId]);
    }
    res.json({ tasks: result.rows, count: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks/ — สร้าง Task ใหม่
router.post('/', async (req, res) => {
  const { title, description, status = 'TODO', priority = 'medium' } = req.body;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (!title) return res.status(400).json({ error: 'title is required' });

  // ล็อก ID ตามบทบาทเพื่อความชัวร์ในการพรีเซนต์
  let userId = req.user.id || req.user.sub;
  if (!userId) {
    userId = (req.user.role === 'admin') ? 3 : 1;
  }

  try {
    let dbStatus = String(status).toUpperCase();
    if (dbStatus === 'DOING') dbStatus = 'IN_PROGRESS';

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, title, description, dbStatus, priority]
    );

    const newTask = result.rows[0];

    await logEvent({
      level: 'INFO', event: 'TASK_CREATED', userId: userId,
      ip, method: 'POST', path: '/api/tasks', statusCode: 201,
      message: `Task created: ${title}`, meta: { task_id: newTask.id }
    });

    res.status(201).json({ task: newTask });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/tasks/:id — อัปเดต Task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;
  const userId = req.user.id || req.user.sub;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // ดึง Task ปัจจุบัน
    const currentTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (!currentTask.rows.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = currentTask.rows[0];

    // ตรวจสอบสิทธิ์: เฉพาะเจ้าของ Task หรือ Admin
    if (task.user_id !== userId && req.user.role !== 'admin') {
      await logEvent({
        level: 'WARN', event: 'TASK_UPDATE_DENIED', userId,
        ip, method: 'PUT', path: `/api/tasks/${id}`, statusCode: 403,
        message: `User ${userId} tried to update task ${id} of user ${task.user_id}`
      });
      return res.status(403).json({ error: 'Forbidden: You cannot update this task' });
    }

    // สร้างคำสั่ง UPDATE แบบ dynamic สำหรับเฉพาะ fields ที่ส่งมา
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (status !== undefined) {
      let dbStatus = String(status).toUpperCase();
      if (dbStatus === 'DOING') dbStatus = 'IN_PROGRESS';
      updates.push(`status = $${paramIndex++}`);
      values.push(dbStatus);
    }
    if (priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      values.push(priority);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const updatedTask = result.rows[0];

    await logEvent({
      level: 'INFO', event: 'TASK_UPDATED', userId,
      ip, method: 'PUT', path: `/api/tasks/${id}`, statusCode: 200,
      message: `Task ${id} updated`, meta: { task_id: id }
    });

    res.json({ task: updatedTask });
  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:id — ลบ Task
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    // ดึง Task ปัจจุบัน
    const currentTask = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (!currentTask.rows.length) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = currentTask.rows[0];

    // ตรวจสอบสิทธิ์: เฉพาะเจ้าของ Task หรือ Admin
    if (task.user_id !== userId && req.user.role !== 'admin') {
      await logEvent({
        level: 'WARN', event: 'TASK_DELETE_DENIED', userId,
        ip, method: 'DELETE', path: `/api/tasks/${id}`, statusCode: 403,
        message: `User ${userId} tried to delete task ${id} of user ${task.user_id}`
      });
      return res.status(403).json({ error: 'Forbidden: You cannot delete this task' });
    }

    // ลบ Task
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

    await logEvent({
      level: 'INFO', event: 'TASK_DELETED', userId,
      ip, method: 'DELETE', path: `/api/tasks/${id}`, statusCode: 200,
      message: `Task ${id} deleted`, meta: { task_id: id }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;