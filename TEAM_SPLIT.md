TEAM_SPLIT.md — Final Lab Set 2 (ใส่ชื่อแล้ว)
# TEAM_SPLIT.md — Final Lab Set 2

## Team Members
- พชร จันทร์ยวง (67543210039-3)
- ชัยมนัส วัฒนปรีดา (67543210069-0)

---

## Work Allocation

### Student 1: พชร จันทร์ยวง (650000001)
- พัฒนา Auth Service
  - เพิ่ม Register API
  - เพิ่ม Login API (JWT)
  - สร้าง Default Admin อัตโนมัติ
  - ปรับ logEvent → บันทึกลง DB โดยตรง
- จัดการฐานข้อมูล auth-db (PostgreSQL)
- Deploy Auth Service + auth-db บน Railway
- เขียน init.sql สำหรับ users table

---

### Student 2: ชัยมนัส วัฒนปรีดา (650000002)
- พัฒนา Task Service
  - CRUD Tasks
  - รับ JWT จาก Auth Service
  - ปรับ logEvent → บันทึกลง DB ของตัวเอง
- พัฒนา User Service (สร้างใหม่)
  - ดึงข้อมูล user profile จาก user_id
- Deploy Task Service + User Service + DB บน Railway
- พัฒนา Frontend
  - Register form
  - Login form
  - config.js สำหรับเรียก API Gateway
  - profile.html สำหรับแสดงข้อมูล user

---

## Shared Responsibilities
- ออกแบบและเขียน docker-compose.yml สำหรับรัน local
- ออกแบบ Architecture Diagram (Microservices + 3 Databases)
- ทดสอบระบบ End-to-End บน Railway
- เขียน README.md และแนบ screenshots การทำงาน

---

## Integration Notes

### 🔐 1. JWT Authentication
- Auth Service ทำหน้าที่ generate JWT token หลัง login
- token จะมีข้อมูล:
  - user_id (sub)
  - username
  - email
  - role

}
🔑 2. JWT_SECRET ต้องตรงกัน

ทุก service (Auth, Task, User, Log) ใช้ JWT_SECRET เดียวกัน

เพื่อให้สามารถ verify token ได้จากทุก service

ตัวอย่าง:

JWT_SECRET=supersecretkey123
🔗 3. การเชื่อมกันด้วย user_id

แต่ละ service มี database แยกกัน

ไม่สามารถใช้ Foreign Key ข้าม database ได้

👉 ใช้ user_id เป็น logical reference

📌 Flow การทำงาน

Login → Auth Service → ได้ JWT

Client ส่ง token ไป Task Service

Task Service decode → ได้ user_id

ใช้ user_id เป็นเจ้าของ task

User Service ใช้ user_id ดึง profile

🧩 4. API Gateway (Nginx)

/api/auth → Auth Service

/api/tasks → Task Service

/api/users → User Service

/api/logs → Log Service

/ → Frontend

⚠️ ข้อจำกัด

ไม่มี Foreign Key ข้าม database

ใช้ user_id เป็น logical reference

ไม่มี distributed transaction

consistency เป็น eventual consistency

⚠️ ปัญหาที่พบและวิธีแก้
❌ ปัญหา 1: Railway clone repository ผิดโครงสร้าง ทำให้หาไฟล์ไม่เจอ

สาเหตุ:
Repository ที่ใช้ deploy มีโครงสร้างเป็นหลายโฟลเดอร์ (เช่น frontend/, auth-service/)
แต่ Railway จะ build จาก root ของ repository ทำให้ไม่พบไฟล์สำคัญ เช่น:

Could not find root directory: frontend
COPY frontend/ /usr/share/nginx/html → not found

ส่งผลให้ build ล้มเหลว และ container ไม่สามารถ start ได้

วิธีแก้:

แยก repository ตาม service (เช่น frontend แยก repo)

หรือปรับโครงสร้างให้ไฟล์ที่ใช้ build อยู่ที่ root

สร้าง branch ใหม่สำหรับ deploy:

git checkout -b deploy-frontend

commit และ push ขึ้น GitHub แล้วเชื่อม Railway ใหม่

ผลลัพธ์:

Railway สามารถ build และ deploy ได้สำเร็จ

container ทำงานได้ปกติ และเข้าผ่าน URL ได้

❌ ปัญหา 2: เกิด error <html> is not valid JSON

สาเหตุ:
frontend เรียก API ผิด endpoint ทำให้ request ไปที่ nginx แล้วถูก redirect ไปหน้า HTML แทนที่จะเป็น JSON

วิธีแก้:

แก้ URL ให้ถูกต้อง:

fetch('/api/auth/login')

ตรวจสอบ routing ใน API Gateway (Nginx) ให้ตรงกับ service

ผลลัพธ์:

API ตอบกลับเป็น JSON ถูกต้อง

frontend สามารถ login ได้สำเร็จ

❌ ปัญหา 3: JWT error (jwt is not defined / JWT_SECRET not defined)

สาเหตุ:

ลืม import library jsonwebtoken

ไม่ได้กำหนดค่า JWT_SECRET

วิธีแก้:

เพิ่ม:

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

ตั้งค่า Environment Variable ใน Railway:

JWT_SECRET=your_secret_key

ผลลัพธ์:

สามารถ generate token ได้

ระบบ login ทำงานได้ปกติ

❌ ปัญหา 4: Database ยังไม่ถูกสร้างแต่มีการ insert ข้อมูล

สาเหตุ:
เรียก createDefaultAdmin() ก่อน initDB() ทำให้ table ยังไม่ถูกสร้าง

วิธีแก้:
จัดลำดับการทำงานใหม่:

await initDB();
await createDefaultAdmin();

ผลลัพธ์:

Database ถูกสร้างก่อนใช้งาน

สามารถ insert admin ได้สำเร็จ

🎯 สรุปภาพรวม

ปัญหาที่พบส่วนใหญ่เกี่ยวข้องกับ:

การ deploy (Railway / Docker)

การเชื่อมต่อระหว่าง services

การตั้งค่า environment และ routing