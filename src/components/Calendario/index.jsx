import React from 'react';

export default function Calendario() {
  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8h às 18h

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">
      {/* Cabeçalho do Calendário */}
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Agenda Semanal
        </h2>
        {/* Aqui podemos futuramente adicionar os botões de navegação da semana ou filtros */}
      </header>

      {/* 
        Grid Principal: 
        Usa o gap-px e o background cinza no container para criar as linhas divisórias finas 
        perfeitamente simétricas entre as células brancas.
      */}
      <div className="grid grid-cols-[60px_repeat(5,1fr)] sm:grid-cols-[80px_repeat(5,1fr)] gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Célula vazia superior esquerda */}
        <div className="bg-gray-50"></div>

        {/* Cabeçalho dos Dias da Semana */}
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            className="bg-gray-50 p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}

        {/* Linhas de Horários e Células de Interação */}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            
            {/* Rótulo da Hora (Alinhado ao topo para design mais limpo) */}
            <div className="bg-white p-2 sm:p-3 text-right text-xs font-medium text-gray-400 flex items-start justify-end pt-2">
              {`${hour.toString().padStart(2, '0')}:00`}
            </div>

            {/* Células de Agendamento daquela hora */}
            {daysOfWeek.map((day) => (
              <div 
                key={`${day}-${hour}`} 
                className="bg-white h-20 sm:h-24 p-1 cursor-pointer transition-colors hover:bg-gray-50 group relative"
                onClick={() => console.log(`Nova reserva: ${day} às ${hour}:00`)}
              >
                {/* Feedback visual sutil (borda tracejada) ao passar o mouse para indicar área clicável */}
                <div className="hidden group-hover:block absolute inset-1 border-2 border-dashed border-indigo-200 rounded-lg pointer-events-none"></div>
                
                {/* Futuro Bloco de Agendamento será renderizado aqui dentro */}
              </div>
            ))}
            
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}