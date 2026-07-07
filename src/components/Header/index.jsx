import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ nome }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("@gesimo:token");
    localStorage.removeItem("@gesimo:nome");
    localStorage.removeItem("@gesimo:role");
    navigate('/');
  };

  const role = localStorage.getItem("@gesimo:role");
  const isAdmin = role === "ADMIN";
  const primeiroNome = nome ? nome.split(' ')[0] : 'Usuário';
  const nomeExibicao = isAdmin ? `${primeiroNome} (ADMIN)` : primeiroNome;
  return (
    //Mantive o layout h-20 e o pl-10 na busca para garantir que o texto não colida com o ícone,
    //mantendo o respiro que prioriza a minimalismo que definimos.
    <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0 shadow-sm">
      
      {/* Área de Busca Global */}
      <div className="w-96 relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Buscar imóveis, clientes..." 
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Área de Perfil e Notificações */}
      <div className="flex items-center gap-6">
        
        {/* Sino de Notificação */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors group">
          <Bell size={20} />
          {/* Indicador de alerta (apenas se houver notificações) */}
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white box-content transition-transform group-hover:scale-110"></span>
        </button>

        {/* Divisor vertical sutil */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* Perfil do Usuário */}
        <div className="relative">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setMenuAberto(!menuAberto)}
          >
            {/* ui-avatars para avatar padronizado */}
            <img 
              src={`https://ui-avatars.com/api/?name=${nome}&background=F3F4F6&color=111827&size=128&bold=true`} 
              alt={`Avatar de ${nome}`} 
              className="w-9 h-9 rounded-full object-cover border border-gray-200 group-hover:ring-2 group-hover:ring-blue-100 transition-all" 
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {nomeExibicao}
              </span>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>

          {/* Menu Dropdown de Sair */}
          {menuAberto && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1 border border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}