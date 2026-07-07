# Digital Time Capsule ⏳

Digital Time Capsule is a modern, full-stack web application designed to help you securely store digital memories—messages, notes, and photos—and lock them away until a specific date in the future. Once the chosen date arrives, the capsule unlocks, allowing you to relive the memory exactly as it was preserved.

## 🌟 Features

* **Time-Locked Memories**: Create capsules with a specific unlock date and time. The content remains strictly inaccessible until the countdown reaches zero.
* **Photo Uploads**: Attach photos and media to your capsules to capture the exact feeling of the moment.
* **Secure Authentication**: Robust user registration and login flows protected by JWT (JSON Web Tokens) and bcrypt password hashing.
* **Premium Glassmorphism UI**: A beautifully crafted, responsive interface utilizing modern CSS glassmorphism effects for a highly engaging user experience.
* **Strict Privacy Controls**: Capsules are private by default, ensuring your personal memories remain yours until you decide to share them.

## 🏗️ Architecture & Tech Stack

This project was built with a decoupled client-server architecture to ensure high scalability, reliability, and maintainability.

* **Frontend**: React.js (via Vite)
  * Implements a lightning-fast Single Page Application (SPA).
  * Uses `react-router-dom` for seamless client-side routing.
  * Custom CSS design system (no heavy CSS frameworks) for precise visual control.
* **Backend**: Node.js & Express.js
  * RESTful API architecture handling business logic and file uploads via `multer`.
  * **Database**: MySQL.
  * **ORM**: Prisma (v5) for type-safe database querying and schema migrations.

## 🚀 Getting Started

To run this project locally, you will need to start both the frontend and backend servers.

### Prerequisites
* Node.js (v18+)
* MySQL Server running locally

### 1. Database Setup
1. Open `server/.env` and configure your `DATABASE_URL` with your MySQL credentials:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/dtc"
   JWT_SECRET="your_secure_secret_key"
   ```
2. Run the Prisma migration to generate the tables:
   ```bash
   cd server
   npx prisma db push
   ```

### 2. Start the Backend Server
```bash
cd server
npm install
node server.js
```
*(The API will run on http://localhost:5000)*

### 3. Start the Frontend Client
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
*(The React app will run on http://localhost:5173)*

## 💡 System Design Considerations
* **Scalability**: The separation of the React client and Express API allows both to be scaled horizontally independent of one another. The file upload system is currently local for feasibility but is designed to be easily swapped with an AWS S3 or Cloudinary storage engine without modifying the frontend.
* **Reliability**: Prisma provides robust, type-safe database interactions, minimizing runtime errors and SQL injection vulnerabilities.

---
*Built with ❤️ for preserving the moments that matter.*
