import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit2, FileText, Trash2 } from "lucide-react"; 
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import DataTable from "../../components/DataTable";
import ModalContainer from "../../components/ModalContainer";
import FormularioImovel from "../../components/Formularios/FormularioImovel";
import FormularioEdicaoImovel from "../../components/Formularios/FormularioEdicaoImovel";
import MenuAcoes from "../../components/MenuAcoes";
import { api } from "../../services/api";

export default function Imoveis() {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem("@gesimo:menuAberto");
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [imoveis, setImoveis] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [imovelEdicao, setImovelEdicao] = useState(null);

  const colunasDaTabela = [
    { key: "imovelExibicao", label: "Imóvel" },
    { key: "tipoExibicao", label: "Tipo" },
    { key: "enderecoExibicao", label: "Endereço" },
    { key: "valorExibicao", label: "Valor" },
    { key: "statusBadge", label: "Status" },
    { key: "acoes", label: "Ações" },
  ];

  const formatarPalavra = (palavra) => {
    if (!palavra) return "";
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
  };

  const carregarImoveis = useCallback(async () => {
    const token = localStorage.getItem("@gesimo:token");

    try {
      const resposta = await api.get(`/imoveis?page=${paginaAtual}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dadosBrutos = resposta.data.data || resposta.data;

      const imoveisFormatados = dadosBrutos.map((imovel) => {
        const bairro = imovel.endereco?.bairro || "";
        const rua = imovel.endereco?.rua || "";
        const numero = imovel.endereco?.numero || "S/N";
        const tipoFormatado = formatarPalavra(imovel.tipologia);

        return {
          ...imovel,
          imovelExibicao: `${tipoFormatado} ${bairro}`,
          tipoExibicao: tipoFormatado,
          enderecoExibicao: `${rua}, ${numero}`,
          valorExibicao: `R$ ${imovel.valorEstimado || "0,00"}`,

          statusBadge: (
            <Badge variant={imovel.status}>
              {formatarPalavra(imovel.status)}
            </Badge>
          ),

          acoes: (
            <div className="flex justify-end">
              <MenuAcoes 
                opcoes={[
                  { 
                    label: 'Visualizar imóvel', 
                    icon: Eye, 
                    onClick: () => navigate(`/imoveis/${imovel.id}`) 
                  },
                  { 
                    label: 'Editar', 
                    icon: Edit2, 
                    onClick: () => {
                        setImovelEdicao(imovel); // Define o imóvel que será editado
                        setModalAberto(true);    // Abre o modal
                    }
                  },
                  { 
                    label: 'Ver contratos', 
                    icon: FileText, 
                    onClick: () => console.log(`Contratos do imóvel ${imovel.id}`) 
                  },
                  { 
                    label: 'Deletar imóvel', 
                    icon: Trash2, 
                    danger: true,
                    onClick: () => console.log(`Soft delete no imóvel ${imovel.id}`) 
                  },
                ]} 
              />
            </div>
          ),
        };
      });

      setImoveis(imoveisFormatados);
      setTotalPaginas(resposta.data.meta?.totalPages || 1);
    } catch (erro) {
      console.error("Erro ao carregar imóveis:", erro);
    }
  }, [paginaAtual, navigate]);

  useEffect(() => {
    setNomeUsuario(localStorage.getItem("@gesimo:nome") || "Usuário");
    carregarImoveis();
  }, [carregarImoveis]);

  useEffect(() => {
    localStorage.setItem("@gesimo:menuAberto", JSON.stringify(menuAberto));
  }, [menuAberto]);

  const botaoNovoImovel = (
    <Button variant="primary" icon={Plus} onClick={() => { setImovelEdicao(null); setModalAberto(true); }}>
      Novo Imóvel
    </Button>
  );

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} nome={nomeUsuario} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nomeUsuario} />

        <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Imóveis</h1>
          <p className="text-gray-500 text-sm mb-8">Catálogo de imóveis cadastrados</p>

          <DataTable
            colunas={colunasDaTabela}
            dados={imoveis}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onPageChange={(nova) => setPaginaAtual(nova)}
            placeholderBusca="Buscar por endereço ou tipo..."
            botaoAcao={botaoNovoImovel}
          />
          <Footer />
        </main>
      </div>

      <ModalContainer
        isOpen={modalAberto}
        onClose={() => { setModalAberto(false); setImovelEdicao(null); }}
        title={imovelEdicao ? "Editar Imóvel" : "Novo Imóvel"}
      >
        {imovelEdicao ? (
            <FormularioEdicaoImovel 
                imovel={imovelEdicao} 
                onClose={() => { setModalAberto(false); setImovelEdicao(null); }} 
                onSuccess={() => { carregarImoveis(); setModalAberto(false); }}
            />
        ) : (
            <FormularioImovel 
                onClose={() => setModalAberto(false)} 
                onSuccess={carregarImoveis} 
            />
        )}
      </ModalContainer>
    </div>
  );
}