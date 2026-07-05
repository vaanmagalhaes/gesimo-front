import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Locadores from './pages/Locadores';

export default function App() {
  return (
    //BrowserRouter é o "envelopador" que habilita a navegação
    <BrowserRouter>
      <Routes>
        {/* <!-- Rota raiz (/) renderiza o Login --> */}
        <Route path="/" element={<Login />} />
        
        {/* <!-- Rota /dashboard renderiza o Dashboard --> */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* <!-- Rota /locadores renderiza o Locadores --> */}
        <Route path="/locadores" element={<Locadores />} />
      </Routes>
    </BrowserRouter>
  );
}