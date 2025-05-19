# 📞 VideoCallingApp

A full-stack video calling and chat application powered by **Stream**, built with **React**, **Express**, and **MongoDB**. It enables users to engage in individual or group chats and video calls with secure authentication, a clean UI, and real-time updates.

---

## 🚀 Live Deployment

**Visit the app**: [http://vivochat-jne8.onrender.com](http://vivochat-jne8.onrender.com)

---

## 📁 Project Structure

```
VideoCallingApp/
├── backend/
│   ├── controllers/        # Business logic (e.g., login, signup)
│   ├── lib/               # MongoDB and Stream configuration
│   ├── middleware/        # Authentication and validation
│   ├── models/            # Mongoose schemas for User and Friends
│   ├── router/            # API route definitions
│   └── ...
├── frontend/
│   └── src/
│       └── ...            # React components, pages, hooks, and services
└── README.md              # This file
```

---

## ⚙️ Getting Started

### 🔧 Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Initialize the project(if package.json not present):
   ```bash
   npm init -y
   ```
3. Install dependencies:
   ```bash
   npm install express
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
5. Ensure MongoDB and Stream credentials are set up in a `.env` file (see below).

### 💻 Frontend Setup

1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the frontend server:
   ```bash
   npm run dev
   ```
3. Ensure the backend server is running before using the frontend.

### 🔐 Environment Variables

Create a `.env` file in the `backend/` folder with the following:

```
MONGO_URI=your_mongodb_connection_string
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

⚠️ **Never commit your `.env` file to version control.**

---

## 🧰 Tech Stack

### 🔙 Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Server framework
- **MongoDB**: NoSQL database
- **Mongoose**: ODM for MongoDB
- **Stream**: Real-time chat and calling

### 🔜 Frontend
- **React.js**: Frontend library
- **TailwindCSS**: Utility-first CSS framework
- **DaisyUI**: UI component library for Tailwind
- **Axios**: HTTP client
- **TanStack Query (React Query)**: Efficient data fetching and caching
- **React Hot Toast**: Toast notifications
- **Stream SDK**: Chat and video calling integrations

---

## ✅ Features

- 🔐 Secure login and signup
- 💬 Real-time messaging (1-on-1 and group chats)
- 📹 High-quality video calling
- ✅ Authentication and token validation
- 🌐 Responsive design
- ⚡ Fast and efficient API state management
- 🎨 Beautiful and clean UI with DaisyUI and TailwindCSS

---

## 📦 Used Libraries

### Frontend Libraries
- DaisyUI
- TailwindCSS
- Stream SDK (chat & call)
- Toaster (react-hot-toast)
- Axios
- TanStack Query (React Query)

### Backend Libraries
- Express
- Mongoose
- Stream server SDK

---

## 🛠 Commands

### Backend
```bash
cd backend          # Enter backend folder
npm run dev         # Start backend server
```

### Frontend
```bash
cd frontend         # Enter frontend folder
npm run dev         # Start frontend development server
```

---


