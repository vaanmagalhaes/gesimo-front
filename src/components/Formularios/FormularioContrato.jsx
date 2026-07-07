import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../Button';
import { Search } from 'lucide-react';

// ==========================================
// SUBCOMPONENTE: BUSCADOR COM FILTRO LOCAL
// ==========================================
const BuscadorPessoa = ({ label, placeholder, endpoint, onSelecionar }) => {
  const [busca, setBusca] = useState('');
  const [todosDados, setTodosDados] = useState([]); // Guarda a lista inteira do banco
  const [resultados, setResultados] = useState([]); // Guarda apenas os filtrados
  const [selecionado, setSelecionado] = useState(null);
  const [foco, setFoco] = useState(false);

  // 1. Busca TODOS os registros UMA única vez quando o componente carrega
useEffect(() => {
    const buscarTodos = async () => {
      try {
        const token = localStorage.getItem("@gesimo:token");
        const resposta = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Garante que é um array
        const dados = resposta.data.data || resposta.data || [];
        
        // 👇 ADICIONE ESTA LINHA PARA INVESTIGARMOS 👇
        console.log(`🕵️ Dados recebidos da rota ${endpoint}:`, dados);
        
        setTodosDados(dados);
      } catch (erro) {
        console.error(`Erro ao buscar dados de ${endpoint}:`, erro);
      }
    };
    
    buscarTodos();
  }, [endpoint]);

  // 2. Filtra localmente via JavaScript sempre que a pessoa digitar algo
  useEffect(() => {
    if (busca.length < 1) {
      setResultados([]);
      return;
    }

    const termoBusca = busca.toLowerCase();
    
    // Filtra a lista completa que está na memória
    const filtrados = todosDados.filter(pessoa => 
      pessoa.nome && pessoa.nome.toLowerCase().includes(termoBusca)
    );
    
    setResultados(filtrados);
  }, [busca, todosDados]);

  const handleSelecionar = (pessoa) => {
    setSelecionado(pessoa);
    setBusca(pessoa.nome);
    setFoco(false);
    onSelecionar(pessoa.id); // Envia o ID para o formulário pai
  };

  return (
    <div className="relative">
      <label className="block text-sm text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={selecionado ? selecionado.nome : busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setSelecionado(null); // Limpa a seleção se o usuário voltar a digitar
            onSelecionar('');
          }}
          onFocus={() => setFoco(true)}
          onBlur={() => setTimeout(() => setFoco(false), 200)} // Delay para dar tempo de clicar na lista
          placeholder={placeholder}
          className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
      </div>

      {/* Dropdown de Resultados */}
      {foco && resultados.length > 0 && !selecionado && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {resultados.map((pessoa) => (
            <li
              key={pessoa.id}
              onClick={() => handleSelecionar(pessoa)}
              className="p-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0"
            >
              {pessoa.nome} <span className="text-gray-400 text-xs ml-2">(ID: {pessoa.id})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ==========================================
// FORMULÁRIO PRINCIPAL
// ==========================================
export default function FormularioContrato({ imovelId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    idLocador: '',
    idLocatario: '',
    dataInicio: '',
    dataFim: '',
    dataReajuste: '',
    valorAluguel: ''
  });

  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setArquivoSelecionado(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idLocador || !formData.idLocatario) {
      alert("Por favor, busque e selecione o Locador e o Locatário na lista.");
      return;
    }

    try {
      const token = localStorage.getItem("@gesimo:token");
      
      const payloadContrato = {
        idImovel: Number(imovelId),
        idLocador: Number(formData.idLocador),
        idLocatario: Number(formData.idLocatario),
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim || undefined,
        dataReajuste: formData.dataReajuste || undefined,
        valorAluguel: Number(formData.valorAluguel)
      };

      const respostaContrato = await api.post('/contratos', payloadContrato, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const novoContratoId = respostaContrato.data.id; 

      if (arquivoSelecionado) {
        const payloadArquivo = new FormData();
        payloadArquivo.append('file', arquivoSelecionado);

        await api.patch(`/contratos/${novoContratoId}/arquivo`, payloadArquivo, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });
      }

      onSuccess();
    } catch (erro) {
      console.error("Erro ao criar contrato:", erro);
      alert("Houve um erro. Verifique o console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-visible">
      <div className="grid grid-cols-2 gap-4">
        
        {/* BUSCADORES SUBSTITUINDO OS INPUTS NUMÉRICOS */}
        <BuscadorPessoa 
          label="Locador (Proprietário)" 
          placeholder="Digite o nome do locador..."
          endpoint="/locadores" 
          onSelecionar={(id) => setFormData(prev => ({ ...prev, idLocador: id }))}
        />

        <BuscadorPessoa 
          label="Locatário (Inquilino)" 
          placeholder="Digite o nome do inquilino..."
          endpoint="/locatarios" 
          onSelecionar={(id) => setFormData(prev => ({ ...prev, idLocatario: id }))}
        />

        <div>
          <label className="block text-sm text-gray-700 mb-1">Data Início</label>
          <input type="date" name="dataInicio" value={formData.dataInicio} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Data Fim (Opcional)</label>
          <input type="date" name="dataFim" value={formData.dataFim} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Data Reajuste (Opcional)</label>
          <input type="date" name="dataReajuste" value={formData.dataReajuste} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Valor do Aluguel (R$)</label>
          <input type="number" step="0.01" name="valorAluguel" value={formData.valorAluguel} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Anexar PDF do Contrato</label>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="pt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
        <Button variant="primary" type="submit">Salvar e Enviar</Button>
      </div>
    </form>
  );
}