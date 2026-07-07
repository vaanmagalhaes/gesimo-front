import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, MoreHorizontal, UploadCloud, FileText, Edit, MapPin, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { api } from '../../services/api';

export default function DetalhesImovel() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [imovel, setImovel] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('contratos');

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem("@gesimo:menuAberto");
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  const abas = [
    { id: 'visao-geral', label: 'Visão Geral' },
    { id: 'contratos', label: 'Contratos' },
    { id: 'despesas', label: 'Despesas' },
  ];

  useEffect(() => {
    setNomeUsuario(localStorage.getItem("@gesimo:nome") || "Usuário");
  }, []);

  useEffect(() => {
    localStorage.setItem("@gesimo:menuAberto", JSON.stringify(menuAberto));
  }, [menuAberto]);

  useEffect(() => {
    const carregarDetalhes = async () => {
      try {
        const token = localStorage.getItem("@gesimo:token");
        const resposta = await api.get(`/imoveis/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setImovel(resposta.data.data || resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar detalhes do imóvel:", erro);
      } finally {
        setCarregando(false);
      }
    };

    if (id) carregarDetalhes();
  }, [id]);

  const formatarPalavra = (palavra) => {
    if (!palavra) return "";
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
  };

  if (carregando) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-gray-500">Carregando informações do imóvel...</p>
      </div>
    );
  }

  if (!imovel) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-red-500">Imóvel não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        nome={nomeUsuario}
      />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nomeUsuario} />

        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          
          <button 
            onClick={() => navigate('/imoveis')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para lista
          </button>
          
          {/* ================= HEADER DO IMÓVEL (AGORA 100% DINÂMICO) ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {/* Título dinâmico: Ex: Apartamento no Centro */}
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {formatarPalavra(imovel.tipologia)} no {imovel.endereco?.bairro || "Bairro não informado"}
                  </h1>
                  <Badge variant={imovel.status || "DISPONIVEL"}>{formatarPalavra(imovel.status || "Disponível")}</Badge>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} />
                  {/* Endereço dinâmico */}
                  <span>
                    {imovel.endereco?.rua || "Endereço não informado"}, {imovel.endereco?.numero || "S/N"} - {imovel.endereco?.cidade || ""} / {imovel.endereco?.estado || ""} - CEP {imovel.endereco?.cep || ""}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" icon={Edit} onClick={() => setModalEdicaoAberto(true)}>
  Editar
</Button>
                <Button variant="secondary">Mais ações</Button>
              </div>
            </div>

            {/* Grid de Informações Básicas com dados reais */}
            <div className="grid grid-cols-4 gap-8 pt-6 border-t border-gray-100">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Tipo</span><span className="font-medium text-gray-900">{formatarPalavra(imovel.tipologia)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Área</span><span className="font-medium text-gray-900">{imovel.area || 0} m²</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Quartos</span><span className="font-medium text-gray-900">{imovel.quartos || 0}</span></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Banheiros</span><span className="font-medium text-gray-900">{imovel.banheiros || 0}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Vagas</span><span className="font-medium text-gray-900">{imovel.vagas || 0}</span></div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Locador</span><span className="font-medium text-gray-900">{imovel.locador?.nome || "Não vinculado"}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Locatário</span><span className="font-medium text-gray-900">{imovel.locatario?.nome || "Não vinculado"}</span></div>
              </div>
              <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-xl">
                 <div className="flex justify-between"><span className="text-gray-500">Valor Estimado</span><span className="font-bold text-blue-600">R$ {imovel.valorEstimado || "0,00"}</span></div>
                 <div className="flex justify-between"><span className="text-gray-500">IPTU</span><span className="font-medium text-gray-900">R$ {imovel.iptu || "0,00"}</span></div>
              </div>
            </div>
          </div>

          {/* ================= NAVEGAÇÃO DE ABAS ================= */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-8">
              {abas.map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`pb-4 text-sm font-medium transition-colors relative
                    ${abaAtiva === aba.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}
                  `}
                >
                  {aba.label}
                  {abaAtiva === aba.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* ================= CONTEÚDO DAS ABAS ================= */}
          {(abaAtiva === 'contratos' || abaAtiva === 'despesas') && (
            <div className="flex gap-6">
              
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {abaAtiva === 'contratos' ? 'Contratos Ativos' : 'Comprovantes de Despesas'}
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nome do arquivo</th>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Tamanho</th>
                        <th className="px-4 py-3 font-medium text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-4 flex items-center gap-3">
                          <FileText size={18} className="text-gray-400" />
                          <span className="font-medium text-gray-500">
                            Integração de documentos em desenvolvimento...
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">-</td>
                        <td className="px-4 py-4 text-gray-500">-</td>
                        <td className="px-4 py-4 text-right"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-72 shrink-0">
                <div className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors p-8 flex flex-col items-center justify-center text-center cursor-pointer h-full min-h-[300px]">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-600">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Arraste arquivos aqui ou <span className="text-blue-600">clique para enviar</span>
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (máx. 10MB)</p>
                  <input type="file" className="hidden" accept=".pdf,image/*" multiple />
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}