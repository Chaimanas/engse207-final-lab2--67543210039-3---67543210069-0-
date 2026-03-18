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







# INDIVIDUAL REPORT
## ชัยมนัส วัฒนปรีดา (67543210069-0)

### หน้าที่ที่รับผิดชอบ
- พัฒนา Task Service (CRUD Tasks)
- ตรวจสอบ JWT จาก Auth Service
- พัฒนา User Service
- Deploy Service บน Railway
- พัฒนา Frontend (Register / Login / Profile)

### ขั้นตอนการทำงาน
ใช้ user_id จาก JWT เป็น owner ของ task  
สร้าง User Service สำหรับดึง profile

### ปัญหาที่พบ
- <html> is not valid JSON
→ เรียก API endpoint ผิด

- Railway หา frontend ไม่เจอ
→ แยก repo หรือสร้าง branch deploy

### ผลลัพธ์
- CRUD Task ทำงานได้
- Frontend login ได้
- แสดง profile ได้

### สิ่งที่ได้เรียนรู้
- Microservices Architecture
- API Gateway (Nginx)
- Debug Deployment