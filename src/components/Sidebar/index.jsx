import React from 'react';
import { LayoutDashboard, Users, LogOut, Menu } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar({ menuAberto, setMenuAberto, nome }) {

  const location = useLocation(); 
  const rotaAtual = location.pathname;
  
  //Centralizei a lógica dos links de navegação em um array.
  //Isso facilita adicionar novas rotas no futuro sem bagunçar o JSX.
  const navLinks = [
    // ATENÇÃO: Verifique se a sua rota principal é '/dashboard' ou apenas '/'
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' }, 
    { icon: Users, label: 'Locadores', path: '/locadores' },
    // Adicionar mais links conforme o projeto crescer
  ];

  return (
    <aside className={`${menuAberto ? 'w-64' : 'w-20'} bg-[#111827] text-gray-300 transition-all duration-300 flex flex-col justify-between shrink-0`}>
      <div>
        {/* Topo da Sidebar (Logo e Botão Toggle) */}
        <div className="p-4 flex items-center justify-between h-20 border-b border-gray-800">
          {menuAberto && <span className="text-white font-bold text-2xl tracking-wide">GESIMO</span>}
          <button onClick={() => setMenuAberto(!menuAberto)} className="p-2 hover:bg-gray-800 rounded-md transition-colors">
            <Menu size={24} color="white" />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="px-3 py-6 flex flex-col gap-2">
          {navLinks.map((link, index) => {
            const Icon = link.icon;
            // AQUI ESTÁ A CORREÇÃO: Compara a rota real do navegador com o path do link
            const isActive = rotaAtual === link.path; 

            return (
              // Substituímos a tag <a> pelo componente <Link> para navegação sem reload
              <Link 
                key={index}
                to={link.path} 
                className={`flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? 'bg-white text-[#111827] font-medium' : 'hover:bg-gray-800 text-gray-300'}`}
              >
                <Icon size={20} />
                {menuAberto && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rodapé da Sidebar (Botão Sair) */}
      <div className="p-4 border-t border-gray-800 hover:text-white cursor-pointer flex items-center gap-3 text-gray-300">
        <LogOut size={20} />
        {menuAberto && <span>Sair</span>}
      </div>
    </aside>
  );
}