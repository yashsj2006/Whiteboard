# Collaborative Whiteboard 🎨

A real-time collaborative whiteboard web application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO.

## Features ✨

*   **Real-time Collaboration:** Draw on the board and see your friends' drawings appear instantly in real-time.
*   **School Vibes Aesthetic:** Enjoy a fun, immersive UI featuring a green chalkboard background and a wooden desk that holds your drawing canvas.
*   **User Authentication:** Complete Register and Login workflow to keep your drawing sessions secure.
*   **Collaborative Cursors:** See exactly who is drawing with live-tracking red cursors and floating name tags for every connected user.
*   **Customizable Tools:** Pick your favorite color from the color picker and adjust the brush size to your liking.

## Tech Stack 🛠️

*   **Frontend:** React (Vite), React Router, HTML5 Canvas, CSS3
*   **Backend:** Node.js, Express.js, Socket.IO
*   **Database:** MongoDB & Mongoose

## Installation and Setup 🚀

To run this project locally, follow these steps:

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.
*   A running instance of MongoDB (Local or MongoDB Atlas).

### 1. Clone the repository

```bash
git clone https://github.com/yashsj2006/Whiteboard.git
cd Whiteboard
```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env` file in the `backend` folder and add your MongoDB URI:
    ```env
    MONGO_URI=mongodb://127.0.0.1:27017/whiteboard
    PORT=5000
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### 3. Frontend Setup

The frontend is already built and statically served by the backend from the `backend/public` directory. However, if you want to modify the frontend code or run the dev server:

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm run dev
    ```

## Usage 🧑‍🏫

1.  Open your browser and navigate to `http://localhost:5000` (or `http://localhost:5173` if using the Vite dev server).
2.  Register a new account.
3.  Log in with your new credentials.
4.  Share the URL with a friend, ask them to create an account, and start drawing together!
