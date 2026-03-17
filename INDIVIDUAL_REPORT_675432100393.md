# INDIVIDUAL_REPORT_67543210039-3

## ข้อมูลผู้จัดทำ
- **ชื่อ-นามสกุล:** พชร จันทร์ยวง
- **รหัสนักศึกษา:** 67543210039-3
- **วิชา:** ENGSE207 Software Engineering (Final Lab Set 1)

## ส่วนที่รับผิดชอบ
ในโปรเจกต์ Task Board Microservices นี้ ผมรับผิดชอบในส่วนของ **Backend Infrastructure** และ **Security** โดยมีเซอร์วิสหลักที่ดูแลดังนี้:
1. **Auth Service:** ระบบยืนยันตัวตนและออกสิทธิ์การเข้าใช้งาน
2. **Log Service:** ระบบจัดเก็บข้อมูลเหตุการณ์ส่วนกลาง (Centralized Logging)
3. **Database Design:** ออกแบบและจัดทำฐานข้อมูลหลักของระบบ

## สิ่งที่ได้ลงมือพัฒนาด้วยตนเอง
- **Auth Service:** พัฒนาด้วย Node.js และ Express โดยใช้ bcryptjs ในการเปรียบเทียบรหัสผ่าน และใช้ jsonwebtoken สำหรับการออก JWT Token เมื่อ User ล็อกอินสำเร็จ
- **Log Service:** สร้าง REST API สำหรับรับข้อมูลกิจกรรมจากเซอร์วิสอื่น (HTTP POST) เพื่อนำมาบันทึกลงใน PostgreSQL และสร้างหน้าแสดงผล Audit Log
- **Database Initialization:** ออกแบบ Schema ทั้งหมด 3 Tables (`users`, `tasks`, `logs`) และเขียนไฟล์ init.sql เพื่อให้ Docker สร้างฐานข้อมูลพร้อมใช้งาน (Seed Data) โดยอัตโนมัติ

## ปัญหาที่พบและวิธีการแก้ไข
- **ปัญหา:** ในช่วงแรกพบไฟล์ขยะชั่วคราว (เช่น `.cwd`) ค้างอยู่ในโฟลเดอร์งานและถูก Git ติดตาม (Track) ทำให้โครงสร้างไฟล์ใน GitHub ดูไม่เป็นระเบียบ
- **การแก้ไข:** ได้ดำเนินการสร้างไฟล์ .gitignore เพื่อยกเว้นไฟล์ชั่วคราวเหล่านั้น และใช้คำสั่ง git rm -r --cached . เพื่อเคลียร์ index ของ Git ใหม่ทั้งหมด ทำให้ Repository สะอาดและเป็นไปตามโครงสร้างที่อาจารย์กำหนด

## สิ่งที่ได้เรียนรู้จากงานนี้
- **Stateless Authentication:** เข้าใจกลไกการใช้ JWT ในการยืนยันตัวตน ซึ่งช่วยให้ Microservices ไม่ต้องเก็บ Session ไว้ที่ Server (Stateless) เพิ่มประสิทธิภาพในการขยายระบบ
- **API Gateway Concept:** เรียนรู้บทบาทของ Nginx ในการทำ Reverse Proxy และ TLS Termination เพื่อเป็นด่านหน้าในการจัดการความปลอดภัยและเส้นทาง (Routing) ของ API
- **Centralized Logging:** เห็นความสำคัญของการรวบรวม Log ไว้ที่จุดเดียวในระบบกระจายตัว (Distributed System) เพื่อความง่ายในการ Debug และการทำ Audit

## แนวทางที่ต้องการพัฒนาต่อใน Set 2
- **Database per Service:** วางแผนจะแยก Database ออกเป็นอิสระต่อกันในแต่ละเซอร์วิส เพื่อลดการยึดติดกัน (Decoupling) ตามหลักการ Microservices ที่แท้จริง
- **Message Queue:** สนใจจะนำระบบ Message Broker เช่น RabbitMQ หรือ Redis Pub/Sub มาใช้ในระบบ Logging แทนการส่งผ่าน HTTP POST เพื่อเพิ่มประสิทธิภาพในการรับส่งข้อมูลแบบ Asynchronous