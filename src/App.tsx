import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';

function App() {

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
