import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Calculator from './pages/Calculator';
import Records from './pages/Records';
import Login from './pages/Login';

const App = () => {
  return (
    <Routes>
      <Route path="/menu" element={<Menu />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/records" element={<Records />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;
