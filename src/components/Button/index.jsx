// src/components/Button/index.jsx
import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  className = '', 
  icon: Icon, // Permite passar um ícone do Lucide opcionalmente
  disabled = false
}) {
  
  // Estilo base: Flexbox para alinhar texto/ícone, cantos arredondados, transições e anel de foco (ring)
  const baseStyle = "inline-flex items-center justify-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";
  
  // Dicionário de variantes com cores e comportamentos específicos
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus:ring-blue-600",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 focus:ring-gray-200",
    outline: "border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm focus:ring-gray-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-700 focus:ring-red-100",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 focus:ring-gray-100" // Útil para o botão "..." da tabela
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
    >
      {/* Renderiza o ícone apenas se ele for passado na chamada do componente */}
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}