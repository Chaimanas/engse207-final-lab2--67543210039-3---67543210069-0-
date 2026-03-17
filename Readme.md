รายงานระบบ Microservices (Set 2)
👨‍🎓 ชื่อนักศึกษา

นาย/นางสาว: พชร จันทร์ยวง
รหัสนักศึกษา: 67543210039-3

นาย/นางสาว: ชัยมนัส วัฒนปรีดา
รหัสนักศึกษา: 67543210069-0

🌐 URL ของทุก Service (Railway)

API Gateway (Nginx)
👉 https://your-gateway.up.railway.app

Auth Service
👉 https://your-auth.up.railway.app

Task Service
👉 https://your-task.up.railway.app

Log Service
👉 https://your-log.up.railway.app

Frontend
👉 https://your-frontend.up.railway.app

🔗 การต่อยอดจาก Set 1 → Set 2

Set 1:

ระบบเป็น monolith หรือ service เดียว

ใช้ database เดียว

ไม่มี gateway

logic รวมกันทั้งหมด

Set 2 (Microservices):

แยกเป็น 3 services:

Auth Service → จัดการ user / login

Task Service → จัดการงาน

Log Service → เก็บ activity log

แต่ละ service มี database แยกของตัวเอง

ใช้ API Gateway (Nginx) เป็นตัวกลาง

ใช้ JWT Token สำหรับ authentication

👉 ข้อดี:

scale แยกได้

deploy แยกได้

ลด coupling

🏗️ Architecture Diagram (Cloud)
[ Client / Browser ]
          |
          ▼
   [ API Gateway (Nginx) ]
     /        |         \
    ▼         ▼          ▼
[Auth]    [Task]     [Log]
  |          |          |
  ▼          ▼          ▼
[DB1]     [DB2]      [DB3]
(Postgres)(Postgres)(Postgres)
🚪 Gateway Strategy
✅ ใช้: Nginx Reverse Proxy
📌 Routing:

/api/auth → Auth Service

/api/tasks → Task Service

/api/logs → Log Service

/ → Frontend

🎯 เหตุผลที่เลือก

ง่ายและ lightweight

config ชัดเจน

รองรับ load balancing ได้

ใช้เป็น entry point เดียว

🐳 วิธีรัน Local (Docker Compose)
docker-compose up --build
📦 Services ที่รัน:

nginx

auth-service

task-service

log-service

postgres (3 ตัว)

📌 หลังรัน:

Gateway: http://localhost

Auth: http://localhost/api/auth

Task: http://localhost/api/tasks

Log: http://localhost/api/logs

⚙️ Environment Variables
Auth Service
DATABASE_URL=postgres://user:pass@auth-db:5432/authdb
JWT_SECRET=your_secret
PORT=3001
Task Service
DATABASE_URL=postgres://user:pass@task-db:5432/taskdb
PORT=3002
Log Service
DATABASE_URL=postgres://user:pass@log-db:5432/logdb
PORT=3003
Nginx
(no env needed)
🧪 วิธีทดสอบด้วย curl (ใช้ URL จริง)
🔐 1. Register
curl -X POST https://your-gateway.up.railway.app/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username":"test","email":"test@test.com","password":"123456"}'
🔑 2. Login
curl -X POST https://your-gateway.up.railway.app/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@test.com","password":"123456"}'
📌 จะได้ token:
{
  "token": "xxxxx"
}
📋 3. Create Task
curl -X POST https://your-gateway.up.railway.app/api/tasks \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{"title":"Test Task"}'
📄 4. Get Tasks
curl https://your-gateway.up.railway.app/api/tasks \
-H "Authorization: Bearer YOUR_TOKEN"
📊 5. Get Logs
curl https://your-gateway.up.railway.app/api/logs \
-H "Authorization: Bearer YOUR_TOKEN"
⚠️ Known Limitations

❌ ไม่มี Foreign Key ข้าม database

❌ แต่ละ service แยก DB → join ข้ามไม่ได้

✅ ใช้ user_id เป็น logical reference แทน FK

❌ ไม่มี distributed transaction

❌ consistency เป็นแบบ eventual consistency

❌ ยังไม่มี retry / circuit breaker

❌ security ยัง basic (JWT อย่างเดียว)