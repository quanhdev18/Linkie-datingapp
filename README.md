# 💘 Linkie Dating App

Linkie là một ứng dụng hẹn hò hiện đại được xây dựng với mục tiêu kết nối mọi người một cách dễ dàng và an toàn. Dự án bao gồm ba thành phần chính:

---

## 📱 Linkie-FE (React Native)

Ứng dụng di động dành cho người dùng cuối.

### 🔧 Công nghệ sử dụng:
- React Native (Expo)
- Axios (gọi API)
- Firebase Authentication (OTP login)
- WebSocket (chat real-time)
- React Navigation, Redux

### ⚙️ Tính năng chính:
- Đăng ký / Đăng nhập bằng số điện thoại (OTP)
- Tạo và chỉnh sửa hồ sơ cá nhân
- Vuốt để thích / bỏ qua
- Chat real-time sau khi match
- Thông báo tương tác
- Bộ lọc theo giới tính, độ tuổi, khu vực
- Mua gói Boost / Premium (MoMo tích hợp)
- Tương tác qua bản đồ (coming soon)

---

## 🧠 Linkie-BE (FastAPI)

Backend API dùng cho cả mobile và admin.

### 🔧 Công nghệ sử dụng:
- Python FastAPI
- PostgreSQL + PostGIS
- Redis (cache vị trí)
- SQLAlchemy ORM
- Firebase Admin SDK
- WebSocket support
- Swagger UI
- Supabase

### 📌 Các module chính:
- Auth (OTP, Token)
- Profile (CRUD, lọc, ảnh)
- Match / Interaction
- Chat (WebSocket + REST)
- Thông báo (real-time)
- Thanh toán và lịch sử mua gói
- Map

---

## 🛠️ Linkie-Admin (Next.js)

Giao diện web cho admin quản trị hệ thống.

### 🔧 Công nghệ sử dụng:
- Next.js (App Router)
- TailwindCSS + ShadCN UI
- Axios + SWR
- React Charts, Lucide Icons

### 🧩 Chức năng:
- Dashboard thống kê
- Quản lý người dùng (ban / duyệt)
- Duyệt báo cáo vi phạm
- Theo dõi lượt swipe, lượt match
- Xem doanh thu từ gói nâng cấp
- Quản lý gói Premium / Boost

---

## 🚀 Cài đặt & chạy thử

### 1. Backend:
cd Linkie-BE
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

### 2. Frontend:
cd Linkie-FE(RN)
npm install -g expo-cli
npx expo start
npx expo start --tunnel
(chạy nhiều máy ảo cùng lúc)

### 3. Admin:
cd Linkie-Admin
npm install
npm start 
