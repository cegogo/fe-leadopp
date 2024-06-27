import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';

function App() {

  useEffect(() => {
    const clearCache = () => {
      // Clear local storage
      localStorage.clear();
      // Clear session storage
      sessionStorage.clear();
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    };
        window.addEventListener('beforeunload', clearCache);

        return () => {
          window.removeEventListener('beforeunload', clearCache);
        };
      }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="*" element={<Home />} />
          <Route path="/app" element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
