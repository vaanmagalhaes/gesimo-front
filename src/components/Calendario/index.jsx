import React from 'react';
import { startOfWeek, addDays, isSameDay, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Calendario({ agendamentos = [] }) {
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
    <div className="w-full max-w-7xl mx-auto font-sans">
      {/* Cabeçalho do Calendário */}
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Agenda Semanal
        </h2>
        {/* Aqui podemos futuramente adicionar os botões de navegação da semana ou filtros */}
      </header>

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
            </div>

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
    </div>
  );
}