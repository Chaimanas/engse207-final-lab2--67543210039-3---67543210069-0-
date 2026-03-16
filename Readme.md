# ENGSE207 Software Architecture

## Final Lab Set 1 — Microservices + HTTPS + Lightweight Logging

---

## 👥 ข้อมูลผู้จัดทำ
| รายชื่อสมาชิก | รหัสนักศึกษา | บทบาทหลัก |
|:---|:---:|:---|
| **พชร จันทร์ยวง** | 67543210039-3 | Full-stack & DevOps Integration |
| **ชัยมนัส วัฒนปรีดา** | 67543210069-0 | Full-stack & DevOps Integration |

---

# 📌 ภาพรวมระบบ (System Overview)

โปรเจกต์นี้เป็นระบบ **Task Board แบบ Microservices Architecture**

ประกอบด้วย:

* 🔐 HTTPS ผ่าน Nginx (Self-Signed Certificate)
* 🔑 JWT Authentication
* 📝 Lightweight Logging เก็บลง PostgreSQL
* 🐳 Docker Compose สำหรับ orchestration
* 💻 Frontend สำหรับจัดการ Task และดู Log

ระบบนี้ **ไม่มี Register**
ใช้เฉพาะ **Seed Users ที่กำหนดไว้**

---

# 🏗️ Architecture Diagram

```
Browser
   │ HTTPS :443
   ▼
Nginx (API Gateway + TLS + Rate Limit)
   ├── /api/auth   → auth-service:3001
   ├── /api/tasks  → task-service:3002
   ├── /api/logs   → log-service:3003
   └── /           → frontend:80
             │
             ▼
         PostgreSQL
```

---

# 📂 โครงสร้าง Repository

```
final-lab-set1/
│
├── nginx/
├── auth-service/
├── task-service/
├── log-service/
├── frontend/
├── db/
├── scripts/
├── screenshots/
│
├── docker-compose.yml
├── README.md
├── TEAM_SPLIT.md
└── INDIVIDUAL_REPORT_xxx.md
```

---

# 🔐 Seed Users สำหรับทดสอบ

| Email                                     | Password  | Role   |
| ----------------------------------------- | --------- | ------ |
| [alice@lab.local](mailto:alice@lab.local) | alice123  | member |
| [bob@lab.local](mailto:bob@lab.local)     | bob456    | member |
| [admin@lab.local](mailto:admin@lab.local) | adminpass | admin  |

⚠️ นักศึกษาได้สร้าง **bcrypt hash จริง** แล้วแทนค่าใน `db/init.sql`

ตัวอย่างการสร้าง hash:

```
node -e "const b=require('bcryptjs'); console.log(b.hashSync('alice123',10))"
```

---

# 🚀 วิธีรันระบบ (How to Run)

## 1️⃣ Clone Repository

```
git clone https://github.com/Chaimanas/Final-Lab-set1.git
cd Final-Lab-set1
```

---

## 2️⃣ สร้าง SSL Certificate (รันครั้งแรกเท่านั้น)

```
chmod +x scripts/gen-certs.sh
./scripts/gen-certs.sh
```

---

## 3️⃣ รันระบบด้วย Docker

```
docker compose up --build
```

---

## 4️⃣ เปิดระบบใน Browser

```
https://localhost
```

กด Accept Certificate Warning (เนื่องจากเป็น self-signed)

---

# 🧪 ตัวอย่างการทดสอบ API

### Login

```
curl -sk -X POST https://localhost/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@lab.local","password":"alice123"}'
```

### Create Task

```
curl -sk -X POST https://localhost/api/tasks/ \
-H "Authorization: Bearer TOKEN"
```

---

# 📝 การทำงานของ Logging

* Auth Service จะ log เมื่อ login สำเร็จ / ล้มเหลว
* Task Service จะ log เมื่อมีการสร้างหรือลบ task
* Services จะส่ง log ไปที่ Log Service ผ่าน REST API
* Log Service บันทึกข้อมูลลง PostgreSQL
* Admin สามารถดู log ผ่านหน้า Log Dashboard

---

# 🔐 Security Features

* ใช้ HTTPS ผ่าน Nginx (TLS Termination)
* ใช้ JWT Middleware ป้องกัน API
* มี Rate Limit สำหรับ Login
* Role-based Access Control (admin / member)
* Endpoint `/api/logs/internal` ถูก block จากภายนอก

---

# ⚠️ ข้อจำกัดของระบบ (Known Limitations)

* ใช้ Shared Database (ยังไม่แยก DB ต่อ service)
* ใช้ Self-Signed Certificate (เหมาะกับ Development)
* ยังไม่มี Horizontal Scaling
* ยังไม่มี Monitoring / Observability แบบ Production

---

# 🔄 9️⃣ วิธี Restart ระบบอย่างถูกต้อง

เมื่อปิดเครื่อง หรือ Docker หยุดทำงาน ให้ทำตามขั้นตอนนี้

---

## ✅ กรณี Restart ปกติ (ข้อมูล DB ยังอยู่)

ให้เปิด **Docker Desktop ก่อน** แล้วรัน:

```
docker compose up -d
```

ระบบจะ start container ทั้งหมดใหม่ โดยยังใช้ข้อมูลเดิมใน PostgreSQL

---

## ❗ กรณีระบบ Error / Login ไม่ได้ / Schema ผิด

ให้ Reset ระบบทั้งหมด:

```
docker compose down -v
docker compose up --build
```

คำสั่งนี้จะ:

* ลบ PostgreSQL volume เก่า
* สร้าง database ใหม่
* รัน `init.sql` ใหม่
* start services ใหม่ทั้งหมด

---

## 🔧 กรณีแก้ `.env` หรือ `init.sql`

ต้อง rebuild ระบบเสมอ:

```
docker compose down -v
docker compose up --build
```

---

## 🧠 ลำดับการ start service (แนวคิด)

1. PostgreSQL ต้อง start ก่อน
2. Auth / Task / Log Service start ต่อ
3. Frontend start
4. Nginx start เป็น Gateway

(Docker Compose จัดการลำดับให้อัตโนมัติ)

---

# 📸 Screenshots

ดูหลักฐานการทดสอบในโฟลเดอร์ `screenshots/`

---

# 📚 สิ่งที่ได้เรียนรู้จากงานนี้

* การออกแบบ Microservices Architecture
* การตั้งค่า Reverse Proxy และ HTTPS
* การทำ JWT Authentication Flow
* การทำ Lightweight Distributed Logging
* การใช้งาน Docker Compose เพื่อ orchestrate services

---
