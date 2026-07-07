import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MapPin, User, Mail, Phone, FileText } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import FormularioLocatario from '../../components/Formularios/FormularioLocatario';
import ModalContainer from '../../components/ModalContainer';
import { api } from '../../services/api';

export default function DetalhesLocatario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditInit = new URLSearchParams(location.search).get('edit') === 'true';

  const [locatario, setLocatario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(isEditInit);

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem("@gesimo:menuAberto");
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  useEffect(() => {
    setNomeUsuario(localStorage.getItem("@gesimo:nome") || "Usuário");
  }, []);

  const carregarDetalhes = async () => {
    try {
      const token = localStorage.getItem("@gesimo:token");
      const resposta = await api.get(`/locatarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocatario(resposta.data.data || resposta.data);
    } catch (erro) {
      console.error("Erro ao carregar detalhes do locatário:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (id) carregarDetalhes();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Deseja realmente apagar (inativar) este locatário?")) {
      try {
        const token = localStorage.getItem("@gesimo:token");
        await api.delete(`/locatarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/locatarios');
      } catch (erro) {
        console.error("Erro ao apagar locatário:", erro);
        alert("Erro ao apagar locatário");
      }
    }
  };

  if (carregando) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-gray-500">Carregando informações...</p>
      </div>
    );
  }

  if (!locatario) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center font-sans">
        <p className="text-red-500">Locatário não encontrado.</p>
      </div>
    );
  }

  const isPF = !!locatario.pessoaFisica;
  const nomeExibicao = isPF ? locatario.pessoaFisica.nome : locatario.pessoaJuridica?.razaoSocial || "N/A";
  const docExibicao = isPF ? locatario.pessoaFisica.cpf : locatario.pessoaJuridica?.cnpj || "N/A";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} nome={nomeUsuario} />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nomeUsuario} />

        <main className="p-8 max-w-7xl mx-auto w-full flex-1">
          
          <button 
            onClick={() => navigate('/locatarios')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para lista
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {nomeExibicao}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin size={16} />
                  <span>
                    {locatario.endereco || "Endereço não informado"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" icon={Edit} onClick={() => setModalEdicaoAberto(true)}>Editar</Button>
                <Button variant="primary" icon={Trash2} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">Apagar</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-gray-100">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1"><User size={16}/><span>{isPF ? "CPF" : "CNPJ"}</span></div>
                <div className="font-medium text-gray-900">{docExibicao}</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1"><Mail size={16}/><span>Email</span></div>
                <div className="font-medium text-gray-900">{locatario.email || "N/A"}</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1"><Phone size={16}/><span>Telefone</span></div>
                <div className="font-medium text-gray-900">{locatario.telefone || "N/A"}</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-1"><FileText size={16}/><span>Contratos</span></div>
                <div className="font-medium text-gray-900">{locatario.contratosCount || 0} vinculados</div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ModalContainer isOpen={modalEdicaoAberto} onClose={() => setModalEdicaoAberto(false)} title="Editar Locatário">
        <FormularioLocatario initialData={locatario} onClose={() => setModalEdicaoAberto(false)} onSuccess={carregarDetalhes} />
      </ModalContainer>
    </div>
  );
}
