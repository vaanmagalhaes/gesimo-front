import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import Locadores from './pages/Locadores';
import Locatarios from './pages/Locatarios';
import Imoveis from './pages/Imoveis';
import DetalhesImovel from './pages/Imoveis/detalhes';
import Agendamentos from './pages/Agendamentos';

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

        {/* <!-- Rota /locatarios renderiza o Locatários --> */}
        <Route path="/locatarios" element={<Locatarios />} />

        {/* <!-- Rota /imoveis renderiza o Imóveis --> */}
        <Route path="/imoveis" element={<Imoveis />} />
        <Route path="/imoveis/:id" element={<DetalhesImovel/>} />

        {/* <!-- Rota /agendamentos renderiza o Agendamento --> */}
        <Route path="/agendamentos" element={<Agendamentos />} />
      </Routes>
    </BrowserRouter>
  );
}