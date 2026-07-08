import React from 'react';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

<<<<<<< HEAD
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
=======
export default function Calendario({ agendamentos = [] }) {
>>>>>>> e48a35470dc3659dab4281f2ac2b9843d66f148d
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8); // 8h às 18h

  // Calcula os dias da semana atual (Segunda a Sexta)
  const hoje = new Date();
  const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }); // Começa na segunda
  const currentWeekDays = Array.from({ length: 5 }, (_, i) => addDays(inicioSemana, i));

  // Função para checar se há evento numa determinada data e hora
  const getEventos = (dia, hora) => {
    return (agendamentos || []).filter(ag => {
      if (!ag.data) return false;
      const dataAg = new Date(ag.data);
      return isSameDay(dataAg, dia) && dataAg.getHours() === hora;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans transition-all duration-300">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 capitalize">
          Visualização: {view}
        </h2>
      </header>

<<<<<<< HEAD
      {isMonth ? (
        // Layout simplificado para Mês/Ano
        <div className={`grid grid-cols-${view === 'month' ? '7' : '4'} gap-2`}>
          {days.map((d) => (
            <div key={d} className="p-4 bg-gray-50 border rounded-lg text-center font-bold text-gray-600">
              {d}
=======
      {/* Grid Principal */}
      <div className="grid grid-cols-[60px_repeat(5,1fr)] sm:grid-cols-[80px_repeat(5,1fr)] gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* Célula vazia superior esquerda */}
        <div className="bg-gray-50"></div>

        {/* Cabeçalho dos Dias da Semana */}
        {currentWeekDays.map((day) => (
          <div 
            key={day.toString()} 
            className="bg-gray-50 p-3 text-center flex flex-col text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            <span>{format(day, 'EEEE', { locale: ptBR })}</span>
            <span className="text-gray-900 text-sm mt-1">{format(day, 'dd/MM')}</span>
          </div>
        ))}

        {/* Linhas de Horários e Células de Interação */}
        {timeSlots.map((hour) => (
          <React.Fragment key={hour}>
            
            {/* Rótulo da Hora */}
            <div className="bg-white p-2 sm:p-3 text-right text-xs font-medium text-gray-400 flex items-start justify-end pt-2">
              {`${hour.toString().padStart(2, '0')}:00`}
>>>>>>> e48a35470dc3659dab4281f2ac2b9843d66f148d
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

<<<<<<< HEAD
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
=======
            {/* Células de Agendamento daquela hora */}
            {currentWeekDays.map((day) => {
              const eventosDaHora = getEventos(day, hour);
              return (
                <div 
                  key={`${day}-${hour}`} 
                  className="bg-white h-20 sm:h-24 p-1 cursor-pointer transition-colors hover:bg-gray-50 group relative overflow-hidden"
                  onClick={() => console.log(`Nova reserva: ${day} às ${hour}:00`)}
                >
                  {/* Feedback visual sutil */}
                  <div className="hidden group-hover:block absolute inset-1 border-2 border-dashed border-indigo-200 rounded-lg pointer-events-none"></div>
                  
                  {/* Bloco de Agendamento */}
                  <div className="flex flex-col gap-1 w-full h-full relative z-10">
                    {eventosDaHora.map((evt, idx) => (
                      <div key={idx} className="bg-blue-50 border-l-2 border-blue-500 text-blue-700 text-[10px] sm:text-xs p-1 rounded">
                        <p className="font-bold truncate" title={evt.tipo}>{evt.tipo || 'Agendamento'}</p>
                        <p className="truncate text-blue-600" title={evt.status}>{evt.status || 'PENDENTE'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
          </React.Fragment>
        ))}
      </div>
>>>>>>> e48a35470dc3659dab4281f2ac2b9843d66f148d
    </div>
  );
}