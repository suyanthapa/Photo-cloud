
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
- Bcrypt
- Email verification with OTP  during user registration.

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

- Navigate to the server folder:

```bash
cd server
```


- Install dependencies:

```bash
npm install
```

- Run the backend locally:

```bash
npm run dev
```

> The backend API is deployed on Render at `https://photo-cloud-2.onrender.com`, so for production the frontend should use this URL.

---

### 3. Frontend Setup

- Navigate to the frontend folder:

```bash
cd ../frontend
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

Check out the live app at: https://photo-cloud-delta.vercel.app/)

---

## 📁 Project Structure

```
Photo-cloud/
├── server/           # Express API server with Prisma & Cloudinary integration
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

## 📝 Notes
This project was initially developed and tested locally. After switching to deployed backend and database services, some features required adjustment to work smoothly in the production environment. If you encounter any issues, please ensure environment variables and CORS settings are correctly configured.

## 🙏 Acknowledgments

- Thanks to the Prisma, Cloudinary, Render, Vercel, and Neon communities for their awesome tools and support.
- Inspired by best practices in modern full-stack web development.
