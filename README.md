# SNOWTEE — เว็บไซต์เมนูสินค้า

เว็บไซต์แสดงรายการอาหารและเครื่องดื่ม SNOWTEE สาขาตลาดกระทุ่มแบน ใช้ **HTML/CSS/JavaScript** แบบ Static เท่านั้น

เว็บไซต์นี้ใช้ **GitHub สำหรับเก็บโค้ด** และ **Cloudflare Pages สำหรับให้บริการเว็บไซต์** โดย **ไม่ใช้ GitHub Pages** และไม่เชื่อม Supabase หรือระบบเดลิเวอรีเดิม

## โครงสร้างไฟล์ที่ต้องนำไปใส่ Repository `snowtee-menu`

```text
snowtee-menu/
├── public/
│   ├── index.html       # หน้าหลักของเว็บไซต์
│   ├── style.css        # รูปแบบการแสดงผล
│   ├── main.js          # ค้นหา กรองหมวด ดูสินค้า
│   ├── menu-data.js     # รายชื่อเมนูและราคา (แก้ตรงนี้)
│   └── assets/          # ภาพสินค้าและภาพเมนู
├── .gitignore
├── README.md
└── คู่มือ_Cloudflare_Pages_SNOWTEE.txt
```

> หากเปิดเว็บไซต์แบบไฟล์ในคอม ให้เปิด `public/index.html` ไม่ใช่ไฟล์ในรูท

## ขั้นตอนติดตั้งผ่าน GitHub Desktop

1. เปิด **GitHub Desktop > File > New repository** แล้วตั้งชื่อ `snowtee-menu` (แยกจาก Repository กระทุ่มแบนไปด้วยกัน)
2. เลือก Local Path ตามต้องการแล้วกด Create repository
3. แตก ZIP นี้ แล้ว **คัดลอกเนื้อหาภายในโฟลเดอร์ `SNOWTEE_Menu_Cloudflare_Ready`** ทั้งหมดลงในโฟลเดอร์ Repository (`snowtee-menu/`) รวมโฟลเดอร์ `public/`
4. GitHub Desktop จะเห็นไฟล์ที่เพิ่มใหม่ เลือก **Commit to main** แล้ว **Publish repository**
5. Repository จะเป็น Private หรือ Public ก็ได้ โดย Cloudflare Pages เชื่อม GitHub ได้ทั้งสองแบบเมื่อให้สิทธิ์เข้าถึง repo

## ขั้นตอนเปิดเว็บไซต์บน Cloudflare Pages

1. เข้า [Cloudflare Dashboard](https://dash.cloudflare.com/) และลงชื่อเข้าใช้หรือสมัครบัญชี
2. เลือก **Workers & Pages > Create application > Pages > Connect to Git** (ชื่อเมนูอาจต่างกันตามรุ่น)
3. เชื่อม GitHub และอนุญาตให้ Cloudflare เข้าถึง `snowtee-menu` (แนะนำเลือกเฉพาะ repo นี้)
4. เลือก repo `snowtee-menu` แล้วตั้งค่า:
   - **Project name:** `snowtee-menu` (ถ้าชื่อนี้ถูกใช้แล้ว ให้ตั้งชื่อใหม่ที่ยังว่าง)
   - **Production branch:** `main`
   - **Framework preset:** `None`
   - **Build command:** *เว้นว่าง* (ไม่มีขั้นตอน build)
   - **Build output directory:** `public`
   - **Root directory:** ค่าเริ่มต้น/เว้นว่าง (repository root)
5. กด **Save and Deploy / Deploy** รอจนสถานะ Success
6. คัดลอก URL ที่ Cloudflare ให้จริง เช่น `https://snowtee-menu.pages.dev` (ขึ้นกับชื่อโปรเจ็กต์ที่ตั้งได้จริง)
7. เปิดทดสอบเว็บไซต์จากมือถือ แล้วเข้า **LINE OA Manager > Rich Menu > ปุ่ม เมนูทั้งหมด > ประเภท ลิงก์** และวาง URL จาก Cloudflare

> อย่ากำหนด GitHub Settings > Pages เพราะไม่จำเป็น และอย่าเลือก Direct Upload หากต้องการให้เว็บไซต์อัปเดตโดยอัตโนมัติทุกครั้งที่ Push GitHub Desktop

## แก้เมนูและราคาในอนาคต

เปิด `public/menu-data.js` แล้วแก้รายการที่ต้องการ:
- `name`: ชื่อเมนูภาษาไทย
- `en`: ชื่อเมนูภาษาอังกฤษ
- `price`: จำนวนบาท เช่น `40`; ถ้ายังไม่ยืนยันราคา ใช้ `null`
- `image`: path ภาพ เช่น `assets/milk-thai.webp`
- `category`: `fruit`, `milk`, `matcha`, `smoothie`, `ice`, `bakery`, `savory`

เมื่อบันทึกไฟล์แล้ว กด **Commit to main** > **Push origin** ใน GitHub Desktop; Cloudflare Pages จะอัปเดตเว็บให้อัตโนมัติเมื่อ deploy สำเร็จ

## คำเตือนสำคัญก่อนเผยแพร่

- เว็บแสดงเมนู ไม่ใช่ระบบสั่งซื้อและไม่เชื่อมฐานข้อมูลเดิม
- ตรวจสอบภาพ ชื่อและราคาสินค้าให้ตรงกับเมนูร้านปัจจุบัน รวมทั้งรายการที่ขึ้น "สอบถามราคา"
- ภาพสินค้าใช้ส่วนตัดจากแผ่นเมนูที่ได้รับ บางภาพอาจมีความละเอียดต่ำ
- กติกาโปรโมชั่นและสะสมแต้มต้องตรวจสอบให้ตรงกับการตั้งค่าจริงใน LINE OA
- เว็บไซต์มีการโหลด Google Fonts จากอินเทอร์เน็ต แต่ไม่ได้ใช้ฐานข้อมูลหรือ API ของร้าน

คู่มือจากผู้ให้บริการ: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/ และ https://developers.cloudflare.com/pages/configuration/git-integration/
