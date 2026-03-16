# 🚀 Task Management Microservices (Set 2 - Cloud Migration)

โปรเจกต์จัดการงานในรูปแบบ Microservices ที่พัฒนาต่อยอดจาก Set 1 เพื่อรองรับการทำงานบนระบบ Cloud (Railway) โดยเน้นความปลอดภัยผ่าน Gateway และความอิสระของฐานข้อมูล

---

### 🧑‍💻 ข้อมูลนักศึกษา
* **[ พชร จัทร์ยวง ]** - 67543210039-3: [รหัส]
* **[ ชัยมนัส วัมนปรีดา ]** - 67543210069-0: [รหัส]

---

### 🌐 Railway Service URLs
| Service | Production URL |
| :--- | :--- |
| **Frontend (UI)** | https://www.facebook.com/photo.php?fbid=1210298607764800&set=a.683592353768764&id=100063540163933 |
| **Gateway (Nginx)** | https://github.com/BertramRay/railway-nginx-basic-auth |
| **Auth Service** | https://auth0.com/ |
| **Task Service** | https://tasksupportservices.org/contact-us |

---

### 📋 Project Overview (Set 1 vs Set 2)
ใน **Set 2** นี้เราได้อัปเกรดระบบจาก Local Monolithic-like ให้กลายเป็น **True Microservices**:
* **Infrastructure:** ย้ายจากเครื่อง Local ไปอยู่บน **Railway Cloud**
* **API Gateway:** เพิ่ม Nginx ทำหน้าที่เป็น Reverse Proxy เพื่อรวมจุดเชื่อมต่อ (Single Entry Point)
* **Database Isolation:** แยกฐานข้อมูล (Database-per-service) ออกจากกันโดยเด็ดขาด 
* **Security:** บังคับใช้ HTTPS และจัดการ CORS ผ่าน Gateway กลาง

---

### 🏗️ Architecture Diagram (Cloud Version)



---

### 🛠️ Services & 3 Databases Design
ระบบของเราแยก Service และ Database ออกเป็น 3 ส่วนอิสระ (3 Services, 3 DBs):
1.  **Auth Service:** จัดการการยืนยันตัวตนและสร้าง JWT Token
    * **Auth-DB (PostgreSQL):** เก็บข้อมูลผู้ใช้และรหัสผ่าน (Hash)
2.  **Task Service:** จัดการ CRUD (Create, Read, Update, Delete) ของงาน
    * **Task-DB (PostgreSQL):** เก็บเฉพาะข้อมูล Task
3.  **Log Service (Internal):** บันทึกประวัติการใช้งาน (Audit Logs)
    * **Log-DB (MongoDB/PostgreSQL):** เก็บเหตุการณ์ที่เกิดขึ้นในระบบ

---

### 🚧 Gateway Strategy
เราเลือกใช้ **Nginx** เป็น Gateway Strategy ด้วยเหตุผลดังนี้:
* **Load Balancing:** สามารถกระจายโหลดไปยัง Service หลังบ้านได้ในอนาคต
* **Security:** ซ่อนโครงสร้าง IP/Port หลังบ้านไม่ให้ User เห็นโดยตรง
* **Header Management:** ทำหน้าที่ส่งต่อ (Forward) Authorization Header ให้กับ Service ต่างๆ อย่างแม่นยำ

---

### 🐳 วิธีรัน Local ด้วย Docker Compose
1. Clone โปรเจกต์ลงมาในเครื่อง
2. รันคำสั่งสร้าง Container:
   ```bash
   docker-compose up --build -d
เข้าใช้งานที่หน้าเว็บ: http://localhost:8080☁️ วิธี Deploy ขึ้น Railwayสร้าง New Project ใน RailwayProvision PostgreSQL 2 ชุดแยกกันสำหรับ Auth และ TaskDeploy แต่ละ Service โดยเลือก Directory ที่ถูกต้องใน GitHub Repoตั้งค่า Public Domain ให้กับ Nginx และ Frontend เท่านั้น (Service อื่นให้รันแบบ Internal)🔑 Environment Variables ที่ใช้VariableDescriptionDATABASE_URLURL สำหรับเชื่อมต่อฐานข้อมูล PostgreSQL ของแต่ละ ServiceJWT_SECRETคีย์ลับสำหรับ Sign และ Verify Token (ต้องตรงกันทุก Service)PORTพอร์ตที่ Service นั้นๆ รัน (เช่น 3001, 3002)🧪 วิธีทดสอบระบบ (curl / Postman)1. ทดสอบ Login เพื่อรับ Token:Bashcurl -X POST [https://your-nginx.railway.app/api/auth/login](https://your-nginx.railway.app/api/auth/login) \
     -H "Content-Type: application/json" \
     -d '{"username":"admin", "password":"password123"}'
2. ทดสอบดึง Task (ต้องแนบ Token):Bashcurl -X GET [https://your-nginx.railway.app/api/tasks](https://your-nginx.railway.app/api/tasks) \
     -H "Authorization: Bearer <YOUR_TOKEN_HERE>"
📸 Screenshots(ใส่รูปหน้า Login ของ Railway)(ใส่รูปหน้า Dashboard แสดงรายการ Task ที่ดึงข้อมูลมาจาก DB)⚠️ Known LimitationsStateless Consistency: ไม่มีการใช้ Foreign Key ข้ามฐานข้อมูลเนื่องจากเป็นคนละ Physical DBLogical Relation: ใช้ user_id จาก JWT เป็นตัวระบุเจ้าของข้อมูล (Logical Reference) เพื่อให้ระบบสามารถ Scale แยกกันได้โดยไม่ติดข้อจำกัดของ Relational Database