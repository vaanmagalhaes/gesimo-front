import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Importações do Recharts para o Gráfico
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
// Importações dos ícones restantes (Home, UserCheck, etc.)
import { Home, UserCheck, Calendar, Users } from 'lucide-react';
// Importe a sua configuração da API (Ajuste o caminho se necessário)
import { api } from '../../services/api';

export default function Dashboard() {
  
  // --- ESTADOS GLOBAIS DO DASHBOARD ---
  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem('@gesimo:menuAberto');
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  const [nome, setNome] = useState('');
  
  // Estado inicial estruturado para não quebrar a tela antes do Back-end responder
  const [dados, setDados] = useState({
    imoveis: 0, locadores: 0, locatarios: 0, compromissos: 0,
    grafico: [],
    contratos: [], // Adicionamos o estado para os contratos
    agenda: [] // NOVO: Adicionamos o estado para a agenda
  });

  // --- EFEITOS ---
  useEffect(() => {
    setNome(localStorage.getItem('@gesimo:nome') || 'Usuário');
    
    // Conexão real com o BFF (Gateway)
    const carregarDadosDoBanco = async () => {
      try {
        const resposta = await api.get('/dashboard/resumo');
        console.log("Dados recebidos da API:", resposta.data);

        setDados({
          imoveis: resposta.data.imoveis || 0,
          locadores: resposta.data.locadores || 0,
          locatarios: resposta.data.locatarios || 0,
          compromissos: resposta.data.compromissos || 0,
          grafico: resposta.data.grafico || [],
          contratos: resposta.data.contratos || [], // Recebe as cores e valores do backend
          agenda: resposta.data.agenda || [] // NOVO: Recebe a agenda formatada do backend
        });
      } catch (erro) {
        console.error("Erro ao buscar dados reais do dashboard:", erro);
      }
    };

    carregarDadosDoBanco();
  }, []);

  // Persiste a preferência do menu
  useEffect(() => {
    localStorage.setItem('@gesimo:menuAberto', JSON.stringify(menuAberto));
  }, [menuAberto]);


  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} nome={nome} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nome} />

        <main className="p-8 max-w-7xl mx-auto w-full">
          
          {/* Saudação Dinâmica */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Olá, {nome.split(' ')[0]}.</h1>
            <p className="text-gray-500">Aqui está um resumo da sua carteira hoje.</p>
          </div>

          {/* CARDS DE KPI */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[ { title: "Imóveis", val: dados.imoveis, icon: Home }, { title: "Locadores", val: dados.locadores, icon: Users }, 
               { title: "Locatários", val: dados.locatarios, icon: UserCheck }, { title: "Compromissos", val: dados.compromissos, icon: Calendar } 
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col group shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-4 border border-gray-100 group-hover:bg-blue-50 transition-colors">
                    <Icon size={20} className="text-gray-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium mb-1">{card.title}</span>
                  <span className="text-4xl font-bold text-gray-900 tracking-tight">{card.val || 0}</span>
                </div>
              );
            })}
          </div>

          {/* SESSÃO CENTRAL: Grid com Contratos e Gráfico Lado a Lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* NOVO: CARD DE CONTRATOS POR VENCIMENTO */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Contratos por Vencimento</h2>
              
              <div className="flex flex-col gap-4">
                {dados.contratos?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                    {/* A cor dinâmica calculada pelo back-end é aplicada aqui */}
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}

                {/* Caso não tenha contratos, exibe um feedback com proteção de tela branca */}
                {(!dados.contratos || dados.contratos.length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhum dado encontrado.</p>
                )}
              </div>
            </div>

            {/* GRÁFICO DE STATUS */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-4 text-left">Imóveis por Status</h2>
              
              <div className="relative w-full h-48 mt-2 flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-gray-900">{dados.imoveis}</span>
                  <span className="text-xs text-gray-400 font-medium">Total</span>
                </div>
                
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dados.grafico} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {dados.grafico?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex gap-6 mt-4 justify-center">
                {dados.grafico?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-xs text-gray-600 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ÉPICO 5: AGENDA DE HOJE */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Agenda de Hoje</h2>
            
            <div className="flex flex-col">
              {dados.agenda?.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-50 py-4 first:pt-0 last:border-0 last:pb-0 group">
                  
                  {/* Horário */}
                  <div className="w-24 shrink-0 text-sm font-medium text-gray-500">
                    {item.time}
                  </div>
                  
                  {/* Descrição e Cliente */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.client}</p>
                  </div>
                  
                  {/* Badge de Status */}
                  <div className="shrink-0 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                  </div>

                </div>
              ))}

              {/* Proteção caso a agenda esteja vazia */}
              {(!dados.agenda || dados.agenda.length === 0) && (
                <p className="text-sm text-gray-400 py-6 text-center">Você não tem compromissos agendados para hoje.</p>
              )}
            </div>
          </div>

          <Footer />

        </main>
      </div>

    </div>
  );
}