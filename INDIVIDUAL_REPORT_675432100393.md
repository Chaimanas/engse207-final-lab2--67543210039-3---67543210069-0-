# INDIVIDUAL REPORT
## พชร จันทร์ยวง (67543210039-3)

### หน้าที่ที่รับผิดชอบ
- พัฒนา Auth Service (Register / Login JWT)
- สร้าง Default Admin อัตโนมัติ
- จัดการ PostgreSQL (auth-db)
- เขียน init.sql
- Deploy Auth Service บน Railway

### ขั้นตอนการทำงาน
ออกแบบ users table และพัฒนา Authentication ด้วย JWT  
Token มี user_id, username, email, role

### ปัญหาที่พบ
- Database ยังไม่สร้างแต่ insert ข้อมูล
→ แก้โดยเรียก initDB() ก่อน createDefaultAdmin()

- JWT_SECRET ไม่ถูกตั้งค่า
→ เพิ่ม Environment Variable ใน Railway

### ผลลัพธ์
- Register / Login ทำงานได้
- ได้ JWT Token
- Deploy สำเร็จ

### สิ่งที่ได้เรียนรู้
- JWT Authentication
- Deploy Microservice
- Environment Variables