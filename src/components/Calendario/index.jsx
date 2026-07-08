import React from 'react';

export default function Calendario({ view }) {
  // Configurações baseadas na view
  const getConfig = () => {
    switch (view) {
      case 'day':
        return { cols: 'repeat(1, 1fr)', days: ['Hoje'] };
      case 'week':
        return { cols: 'repeat(5, 1fr)', days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'] };
      case 'month':
        return { cols: 'repeat(7, 1fr)', days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], isMonth: true };
      default: // Ano
        return { cols: 'repeat(4, 1fr)', days: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], isMonth: true };
    }
  };

  const { cols, days, isMonth } = getConfig();
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8h às 18h

  return (
    <div className="w-full max-w-7xl mx-auto font-sans transition-all duration-300">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">
          Visualização: {view}
        </h2>
      </header>

      {isMonth ? (
        // Layout simplificado para Mês/Ano
        <div className={`grid grid-cols-${view === 'month' ? '7' : '4'} gap-2`}>
          {days.map((d) => (
            <div key={d} className="p-4 bg-gray-50 border rounded-lg text-center font-bold text-gray-600">
              {d}
            </div>
          ))}
        </div>
      ) : (
        // Layout de Grade (Dia/Semana)
        <div 
          className="grid gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm"
          style={{ gridTemplateColumns: `60px ${cols}` }}
        >
          <div className="bg-gray-50"></div>
          {days.map((day) => (
            <div key={day} className="bg-gray-50 p-3 text-center text-xs font-semibold text-gray-500 uppercase">
              {day}
            </div>
          ))}

          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              <div className="bg-white p-2 text-right text-xs font-medium text-gray-400">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {days.map((day) => (
                <div 
                  key={`${day}-${hour}`} 
                  className="bg-white h-20 p-1 cursor-pointer hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="hidden group-hover:block absolute inset-1 border-2 border-dashed border-indigo-200 rounded-lg pointer-events-none"></div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}