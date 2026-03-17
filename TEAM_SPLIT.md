Markdown
# TEAM_SPLIT.md

## Team Members
- 67543210039-3 พชร จันทร์ยวง
- 67543210069-0 ชัยมนัส วัฒนปรีดา

## Work Allocation

### Student 1: พชร จันทร์ยวง
- รับผิดชอบ **Auth Service** (ระบบยืนยันตัวตน และการออก JWT)
- รับผิดชอบ **Log Service** (ระบบบันทึก Audit Log กลาง)
- ออกแบบและจัดการ **Database Schema** (PostgreSQL init script)

### Student 2: ชัยมนัส วัฒนปรีดา
- รับผิดชอบ **Task Service** (ระบบจัดการ CRUD ของ Task ทั้งหมด)
- รับผิดชอบ **Nginx Reverse Proxy** และการตั้งค่า **HTTPS/SSL Certificate**
- รับผิดชอบ **Frontend** (UI) และการทำ **Docker Compose Integration**

## Shared Responsibilities
- ออกแบบ Architecture Diagram ของระบบร่วมกัน
- ร่วมกันแก้ไขปัญหา (Debug) การเชื่อมต่อระหว่าง Microservices ผ่าน Nginx
- จัดทำ README และรวบรวม Screenshots สำหรับการส่งงาน

## Reason for Work Split
เราแบ่งงานตาม **Service Boundary** เพื่อให้แต่ละคนได้ฝึกการเขียน Microservice ที่สมบูรณ์ตั้งแต่ Logic ไปจนถึงการจัดการ Data โดยแบ่งความรับผิดชอบในส่วน Security (Auth) และ Core Business (Task) ออกจากกันเพื่อความชัดเจนในการพัฒนา

## Integration Notes
งานของทั้งสองคนเชื่อมต่อกันผ่าน **Nginx API Gateway** โดยที่ Frontend (ชัยมนัส) จะส่ง Request ไปขอ Token จาก Auth Service (พชร) และนำ Token นั้นมาแนบใน Header เพื่อเรียกใช้งาน Task Service (ชัยมนัส) โดยทุกกิจกรรมจะถูกส่งไปบันทึกที่ Log Service (พชร) เพื่อความโปร่งใสของระบบ
2. ไฟล์ INDIVIDUAL_REPORT_67543210039-3.md (ของคุณพชร)
Markdown
# INDIVIDUAL_REPORT_67543210039-3

## ข้อมูลผู้จัดทำ
- **ชื่อ-นามสกุล:** พชร จันทร์ยวง
- **รหัสนักศึกษา:** 67543210039-3

## ส่วนที่รับผิดชอบ
- ระบบยืนยันตัวตน (Auth Service)
- ระบบบันทึกข้อมูลเหตุการณ์ (Log Service)
- การออกแบบฐานข้อมูล (Database Design)

## สิ่งที่ได้ลงมือพัฒนาด้วยตนเอง
- พัฒนา Auth Service ด้วย Node.js เพื่อจัดการ Login และออก JWT Token
- ออกแบบ SQL Script สำหรับสร้าง Table Users, Tasks และ Logs พร้อม Seed ข้อมูลเบื้องต้น
- สร้าง Log Service เพื่อรับข้อมูลแบบ POST จาก Service อื่นๆ มาบันทึกลง PostgreSQL

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** ไฟล์ขยะพวก .cwd หรือไฟล์ Temp หลุดเข้าไปใน Git ทำให้โครงสร้างดูไม่เรียบร้อย
- **การแก้ไข:** แก้ไขไฟล์ .gitignore เพื่อป้องกันไฟล์เหล่านั้น และใช้คำสั่ง git rm --cached เพื่อลบไฟล์ที่เผลอ Commit ออกจากระบบโดยไม่กระทบไฟล์จริง

## สิ่งที่ได้เรียนรู้จากงานนี้
- เข้าใจการทำงานของ Stateless Authentication โดยใช้ JWT
- เรียนรู้การจัดการฐานข้อมูลเดียว (Shared Database) ในบริบทของ Microservices

## แนวทางที่ต้องการพัฒนาต่อใน Set 2
- ต้องการแยก Database ออกเป็นของแต่ละ Service (Database per Service) เพื่อให้ตรงตามมาตรฐาน Microservices มากยิ่งขึ้น
3. ไฟล์ INDIVIDUAL_REPORT_67543210069-0.md (ของเพื่อน)
Markdown
# INDIVIDUAL_REPORT_67543210069-0

## ข้อมูลผู้จัดทำ
- **ชื่อ-นามสกุล:** ชัยมนัส วัฒนปรีดา
- **รหัสนักศึกษา:** 67543210069-0

## ส่วนที่รับผิดชอบ
- ระบบจัดการงาน (Task Service)
- การตั้งค่า Nginx Reverse Proxy และ HTTPS
- การพัฒนาส่วนหน้าจอ (Frontend) และ Docker Compose

## สิ่งที่ได้ลงมือพัฒนาด้วยตนเอง
- พัฒนา Task Service สำหรับ CRUD ข้อมูลงาน โดยมีการเช็คสิทธิ์ผ่าน JWT Middleware
- กำหนดค่า nginx.conf เพื่อทำ TLS Termination และกระจาย Request ไปยัง Service ต่างๆ
- เขียน docker-compose.yml เพื่อให้ทุก Container ทำงานร่วมกันได้ผ่าน Network เดียวกัน

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** การเข้าใช้งานผ่าน HTTPS ในช่วงแรกติดปัญหาเรื่อง Certificate ไม่น่าเชื่อถือบนเบราว์เซอร์
- **การแก้ไข:** สร้าง Self-signed Certificate และตั้งค่า Nginx ให้ชี้ไปยัง Path ของ Key และ CRT อย่างถูกต้อง พร้อมแจ้งผู้ใช้งานให้กดยอมรับความเสี่ยงในหน้าเบราว์เซอร์

## สิ่งที่ได้เรียนรู้จากงานนี้
- เรียนรู้การทำงานของ API Gateway และการทำ Reverse Proxy ด้วย Nginx
- เข้าใจการทำ Containerization ด้วย Docker และการใช้ Docker Compose จัดการระบบหลายเซอร์วิส

## แนวทางที่ต้องการพัฒนาต่อใน Set 2
- พัฒนาหน้าจอ Frontend ให้เป็น Single Page Application (SPA) ด้วย React เพื่อความลื่นไหลในการใช้งานมากขึ้น