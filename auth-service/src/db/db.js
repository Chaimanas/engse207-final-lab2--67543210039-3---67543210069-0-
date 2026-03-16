const { Pool } = require('pg');

const pool = new Pool({
  // เปลี่ยนเป็น auth-db เพื่อให้คุยกับ container ฐานข้อมูลของ auth ได้
  host:     process.env.DB_HOST || 'auth-db', 
  port:     5432,
  database: process.env.DB_DATABASE || 'authdb',  // เช็คชื่อ DB ใน docker-compose อีกทีนะ
  user:     process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'secret',  // เช็ค password ใน docker-compose อีกทีนะ
});

module.exports = { pool };
