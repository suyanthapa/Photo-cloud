
# 📸 PhotoCloud

A full-stack photo sharing web application that allows users to securely register, upload, view, edit, delete, and share photos with others. Built using modern technologies like React, Node.js, Express.js, TypeScript, Prisma, and JWT-based authentication.

## 🚀 Features

### ✅ Completed

- 🔐 **User Authentication**
  - Register and login
  - JWT token generation
  - Cookie-based authentication
- 📸 **Photo Management**
  - Upload photos (stored in Cloudinary)
  - View all uploaded photos
  - Edit photo descriptions
  - Delete photos
- 👥 **Sharing**
  - Share photos with other registered users by email or username

### 🛠️ Upcoming Features (To Do)

- 🗂️ View photos shared *with* the user
- 🙍 Profile management (update profile info, change password, etc.)

---

## 🧑‍💻 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- JWT & Cookie-based Authentication
- Multer for handling file uploads
- Cloudinary SDK for image storage

### Database

- PostgreSQL (hosted on Neon)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/suyanthapa/Photo-cloud.git
cd Photo-cloud
```

### 2. Backend Setup

- Navigate to the backend folder:

```bash
cd backend
```

- Create a `.env` file with the following environment variables (replace values with your own):

```env
DATABASE_URL=your_neon_database_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
```

- Install dependencies:

```bash
npm install
```

- Run the backend locally:

```bash
npm run dev
```

> The backend API is deployed on Render at `https://your-backend-render-url`, so for production the frontend should use this URL.

---

### 3. Frontend Setup

- Navigate to the frontend folder:

```bash
cd ../frontend
```

- Create a `.env` file with:

```env
VITE_API_URL=https://your-backend-render-url/api/data
```

- Install dependencies:

```bash
npm install
```

- Run the frontend locally:

```bash
npm run dev
```

---

### 4. Deployment Overview

- **Backend**: Deployed on [Render](https://render.com/)
- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Database**: Serverless PostgreSQL on [Neon](https://neon.tech/)
- **Image Storage**: Cloudinary

### Live Demo

Check out the live app at: [https://photo-cloud-zeta.vercel.app/live](https://photo-cloud-zeta.vercel.app/live)

---

## 📁 Project Structure

```
Photo-cloud/
├── backend/           # Express API server with Prisma & Cloudinary integration
├── frontend/          # React frontend using Vite & Tailwind CSS
├── README.md          # Project documentation (this file)
```
---

## 📝 Notes

- Make sure to configure environment variables properly in both backend and frontend.
- Image files are uploaded to Cloudinary and their URLs saved in the database.
- Database migrations and Prisma client generation can be done via:

```bash
npx prisma migrate dev
npx prisma generate
```

---

## 🙏 Acknowledgments

- Thanks to the Prisma, Cloudinary, Render, Vercel, and Neon communities for their awesome tools and support.
- Inspired by best practices in modern full-stack web development.
