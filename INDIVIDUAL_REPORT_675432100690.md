# INDIVIDUAL_REPORT_67543210069-0

## ข้อมูลผู้จัดทำ
- **ชื่อ-นามสกุล:** ชัยมนัส วัฒนปรีดา
- **รหัสนักศึกษา:** 67543210069-0
- **วิชา:** ENGSE207 Software Engineering (Final Lab Set 1)

## ส่วนที่รับผิดชอบ
ในโปรเจกต์ Task Board Microservices นี้ ผมรับผิดชอบในส่วนของ **Application Logic** และ **Deployment Orchestration** โดยมีส่วนงานหลักดังนี้:
1. **Task Service:** เซอร์วิสหลักในการจัดการข้อมูลงาน (Core Business Logic)
2. **Nginx API Gateway:** การตั้งค่า Reverse Proxy และความปลอดภัย HTTPS (SSL)
3. **Frontend & Integration:** พัฒนาส่วนหน้าจอผู้ใช้งานและรวบรวมระบบด้วย Docker Compose

## สิ่งที่ได้ลงมือพัฒนาด้วยตนเอง
- **Task Service:** พัฒนา RESTful API สำหรับการจัดการ Task (CRUD) โดยมีการสร้าง Middleware เพื่อตรวจสอบ JWT Token ที่ส่งมาจาก Gateway ก่อนอนุญาตให้เข้าถึงข้อมูล
- **Nginx Configuration:** เขียนไฟล์การตั้งค่า nginx.conf เพื่อทำหน้าที่เป็น API Gateway จัดการเส้นทาง (Routing) และทำ TLS Termination เพื่อให้ระบบรองรับการเชื่อมต่อผ่านพอร์ต 443 (HTTPS)
- **Frontend Development:** พัฒนาหน้าเว็บด้วย HTML/JavaScript ที่สามารถติดต่อกับ Microservices ต่างๆ ได้ผ่าน API Gateway รวมถึงการจัดการ State ของ Token ในฝั่ง Client
- **Docker Compose:** รวบรวมทุกเซอร์วิสให้ทำงานร่วมกันผ่าน Container Network เดียวกัน เพื่อให้ระบบสามารถรันได้ด้วยคำสั่งเดียว

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** พบปัญหา Browser บล็อกการเชื่อมต่อเนื่องจากใบรับรอง SSL เป็นแบบ Self-signed ทำให้ไม่สามารถเรียก API ผ่าน HTTPS ได้ในช่วงแรก
- **การแก้ไข:** ได้ตั้งค่า Nginx ให้รองรับ Cipher Suites ที่ทันสมัย และทำการแจ้งเตือนผู้ใช้งานให้กดยอมรับความเสี่ยงในหน้าเบราว์เซอร์ (Proceed to localhost) เพื่อให้สามารถทดสอบระบบในสภาพแวดล้อมการพัฒนาได้

## สิ่งที่ได้เรียนรู้จากงานนี้
- **API Gateway Role:** เข้าใจการทำงานของ Nginx ในฐานะตัวกลางที่ช่วยซ่อนความซับซ้อนของโครงสร้างหลังบ้าน (Port/Service) ให้เหลือเพียง Entry Point เดียว
- **Container Orchestration:** เรียนรู้การจัดการ Lifecycle ของ Microservices หลายๆ ตัวพร้อมกันด้วย Docker Compose และการจัดการ Environment Variables
- **System Integration:** เข้าใจความสำคัญของการเชื่อมต่อกันระหว่าง Frontend และ Backend ภายใต้ข้อกำหนดความปลอดภัย (CORS และ HTTPS)

## แนวทางที่ต้องการพัฒนาต่อใน Set 2
- **Frontend Modernization:** วางแผนจะเปลี่ยนจากการเขียนหน้าเว็บแบบดั้งเดิมไปใช้ React Framework เพื่อการจัดการ State ที่มีประสิทธิภาพมากขึ้น
- **Rate Limiting:** ต้องการเพิ่มขีดความสามารถของ Nginx ในการทำ Rate Limiting เพื่อป้องกันการโจมตีแบบ Brute Force หรือการเรียกใช้งาน API ที่ถี่เกินไปในอนาคต