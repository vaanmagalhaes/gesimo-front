import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MiniCalendario({ agendamentos = [] }) {
  // Estados para controlar o mês visível e o dia que o usuário clicou
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());

  // Funções fluídas de navegação
  const irParaMesAnterior = () => setMesAtual(subMonths(mesAtual, 1));
  const irParaProximoMes = () => setMesAtual(addMonths(mesAtual, 1));

  // O "Cérebro" do calendário: calculando os dias exatos para preencher a grade
  const inicioDoMes = startOfMonth(mesAtual);
  const fimDoMes = endOfMonth(mesAtual);
  // Pega do primeiro domingo da grade até o último sábado
  const inicioDaGrade = startOfWeek(inicioDoMes, { weekStartsOn: 0 }); 
  const fimDaGrade = endOfWeek(fimDoMes, { weekStartsOn: 0 });

  // Gera o array real de dias que serão renderizados
  const diasDaGrade = eachDayOfInterval({
    start: inicioDaGrade,
    end: fimDaGrade,
  });

  const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  // Formata o mês para exibição (ex: "Julho 2026")
  const mesFormatado = format(mesAtual, 'MMMM', { locale: ptBR });
  // Capitaliza a primeira letra do mês
  const mesCapitalizado = mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1);
  const anoFormatado = format(mesAtual, 'yyyy');

  return (
    <div className="w-full select-none">
      {/* Cabeçalho do Mês */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-light text-white tracking-tight">
          {mesCapitalizado} <span className="font-semibold text-red-500">{anoFormatado}</span>
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={irParaMesAnterior}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={irParaProximoMes}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grade de Dias */}
      <div className="grid grid-cols-7 gap-y-4 text-center">
        {/* Cabeçalho dos Dias da Semana */}
        {diasSemana.map((dia) => (
          <div key={dia} className="text-[10px] font-bold text-gray-400 tracking-widest mb-2">
            {dia}
          </div>
        ))}

        {/* Células dos Dias */}
        {diasDaGrade.map((dia, idx) => {
          const pertenceAoMes = isSameMonth(dia, mesAtual);
          const isSelecionado = isSameDay(dia, diaSelecionado);
          
          // Verifica se existem agendamentos para o dia atual
          const agendamentosDoDia = (agendamentos || []).filter(ag => {
            if (!ag.data) return false;
            // Cria a data levando em consideração o timezone
            const dt = new Date(ag.data);
            // Ajusta o timezone se necessário, ou usa date-fns parse/isSameDay
            return isSameDay(dt, dia);
          });
          const temEvento = pertenceAoMes && agendamentosDoDia.length > 0; 

          return (
            <div 
              key={idx} 
              onClick={() => setDiaSelecionado(dia)}
              className="flex flex-col items-center justify-start h-10 cursor-pointer group"
            >
              {/* Número do Dia */}
              <div className={`
                w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all
                ${!pertenceAoMes ? 'text-gray-600' : 'text-gray-300'}
                ${pertenceAoMes && !isSelecionado ? 'hover:bg-white/10 hover:text-white' : ''}
                ${isSelecionado ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/50' : ''}
              `}>
                {format(dia, 'd')}
              </div>

              {/* Indicadores de Evento */}
              <div className="flex gap-1 mt-1">
                {temEvento && (
                  <>
                    <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                    <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}