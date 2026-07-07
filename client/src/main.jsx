import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import CreateCapsule from './pages/CreateCapsule.jsx';
import ViewCapsule from './pages/ViewCapsule.jsx';
import Whiteboard from './pages/Whiteboard.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<Login isRegister={false} />} />
          <Route path="register" element={<Login isRegister={true} />} />
          <Route path="create" element={<CreateCapsule />} />
          <Route path="capsule/:id" element={<ViewCapsule />} />
          <Route path="whiteboard" element={<Whiteboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
