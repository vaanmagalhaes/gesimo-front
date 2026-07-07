import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../Button';

export default function FormularioAgendamento({ onClose, onSuccess }) {
  // 1. Estados para armazenar as listas vindas do banco de dados
  const [imoveis, setImoveis] = useState([]);
  const [locadores, setLocadores] = useState([]);
  const [locatarios, setLocatarios] = useState([]);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // 2. Estado para os dados preenchidos no formulário
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: 'VISITA', // VISITA, REUNIAO, ASSINATURA, etc. (baseado no Figma)
    data: '',
    horaInicio: '',
    id_imovel: '',
    id_locador: '',
    id_locatario: '',
    observacoes: ''
  });

  // 3. Busca os dados reais assim que o modal abre
  useEffect(() => {
    const buscarDadosParaSelects = async () => {
      try {
        const token = localStorage.getItem("@gesimo:token");
        const headers = { Authorization: `Bearer ${token}` };

        // Dispara as 3 requisições simultaneamente para ser mais rápido
        const [resImoveis, resLocadores, resLocatarios] = await Promise.all([
          api.get('/imoveis', { headers }),
          api.get('/locadores', { headers }),
          api.get('/locatarios', { headers })
        ]);

        // Adapte o ".data.data" dependendo de como sua API pagina ou retorna os arrays
        setImoveis(resImoveis.data.data || resImoveis.data);
        setLocadores(resLocadores.data.data || resLocadores.data);
        setLocatarios(resLocatarios.data.data || resLocatarios.data);
      } catch (erro) {
        console.error("Erro ao carregar listas do formulário:", erro);
        // Aqui você pode colocar um toast de erro futuramente
      } finally {
        setCarregandoDados(false);
      }
    };

    buscarDadosParaSelects();
  }, []);

  // 4. Lida com a digitação nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. Envia o formulário para a sua API (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("@gesimo:token");
      
      // Formatação da data final para o back-end (Prisma exige ISO-8601 Date)
      // Ex: junta "2026-07-10" com "14:00" e transforma em formato DateTime do Prisma
      const dataIsoString = new Date(`${formData.data}T${formData.horaInicio}`).toISOString();

      const payload = {
        titulo: formData.titulo,
        tipo: formData.tipo,
        data: dataIsoString,
        status: 'AGENDADO', // Status inicial padrão
        id_imovel: formData.id_imovel ? Number(formData.id_imovel) : null,
        id_locador: formData.id_locador ? Number(formData.id_locador) : null,
        id_locatario: formData.id_locatario ? Number(formData.id_locatario) : null,
      };

      await api.post('/agendamentos', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Se der sucesso, fecha o modal e recarrega a grade
      if (onSuccess) onSuccess();
      onClose();
    } catch (erro) {
      console.error("Erro ao criar agendamento:", erro);
    }
  };

  // Classes padrão para os inputs (mantendo o minimalismo)
  const inputClassName = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-gray-700";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  if (carregandoDados) {
    return <div className="p-8 text-center text-gray-500">Carregando informações do sistema...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      
      {/* Linha 1: Título e Tipo */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Título do Compromisso</label>
          <input 
            type="text" 
            name="titulo" 
            value={formData.titulo} 
            onChange={handleChange} 
            placeholder="Ex: Visita - Apartamento Centro" 
            className={inputClassName}
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Tipo</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange} className={inputClassName}>
            <option value="VISITA">Visita</option>
            <option value="REUNIAO">Reunião</option>
            <option value="ASSINATURA">Assinatura de Contrato</option>
            <option value="VISTORIA">Vistoria</option>
              <option value="FOLGA">Folga</option>
                <option value="OUTROS">Outros</option>
          </select>
        </div>
      </div>

      {/* Linha 2: Data e Hora (Mantendo a lógica de bloco fechado sugerida pelo P.O.) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Data</label>
          <input 
            type="date" 
            name="data" 
            value={formData.data} 
            onChange={handleChange} 
            className={inputClassName}
            required
          />
        </div>
        <div>
          <label className={labelClassName}>Horário Inicial</label>
          <input 
            type="time" 
            name="horaInicio" 
            value={formData.horaInicio} 
            onChange={handleChange} 
            className={inputClassName}
            required
          />
        </div>
      </div>

      {/* Linha 3: Imóvel Relacionado */}
      <div>
        <label className={labelClassName}>Imóvel Referente (Opcional)</label>
        <select name="id_imovel" value={formData.id_imovel} onChange={handleChange} className={inputClassName}>
          <option value="">Nenhum imóvel específico</option>
          {imoveis.map(imovel => (
             // Ajuste `imovel.id` e o texto conforme o retorno real da sua API
            <option key={imovel.id} value={imovel.id}>
              {imovel.tipologia} - {imovel.endereco?.bairro || 'Endereço não cadastrado'} 
            </option>
          ))}
        </select>
      </div>

      {/* Linha 4: Locador e Locatário */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClassName}>Locador Envolvido (Opcional)</label>
          <select name="id_locador" value={formData.id_locador} onChange={handleChange} className={inputClassName}>
            <option value="">Selecione...</option>
            {locadores.map(locador => (
              <option key={locador.id} value={locador.id}>{locador.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClassName}>Locatário Envolvido (Opcional)</label>
          <select name="id_locatario" value={formData.id_locatario} onChange={handleChange} className={inputClassName}>
            <option value="">Selecione...</option>
            {locatarios.map(locatario => (
              <option key={locatario.id} value={locatario.id}>{locatario.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Salvar Agendamento
        </Button>
      </div>
    </form>
  );
}