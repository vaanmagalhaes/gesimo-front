// src/pages/Locadores/index.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import DataTable from "../../components/DataTable";
import ModalContainer from "../../components/ModalContainer"; // Importe o container
import FormularioLocador from "../../components/Formularios/FormularioLocador"; // Importe o formulário
import { api } from "../../services/api";

export default function Locadores() {
  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem("@gesimo:menuAberto");
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  const [nome, setNome] = useState("");
  const [locadores, setLocadores] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  // 1. Estado para controlar o modal
  const [modalAberto, setModalAberto] = useState(false);

  const colunasDaTabela = [
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "imoveis", label: "Imóveis" },
    { key: "acoes", label: "Ações" },
  ];

  // 2. Usamos useCallback para que a função possa ser chamada de outros lugares
  const carregarLocadores = useCallback(async () => {
    // Pegamos o token do localStorage
    const token = localStorage.getItem("@gesimo:token");

    console.log("TOKEN QUE ESTÁ INDO:", token)
    
    try {
      // INJETAMOS O TOKEN AQUI NO CABEÇALHO DA REQUISIÇÃO
      const resposta = await api.get(`/locadores?page=${paginaAtual}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setLocadores(resposta.data.data || resposta.data);
      setTotalPaginas(resposta.data.meta?.totalPages || 1);
    } catch (erro) {
      console.error("Erro ao carregar locadores:", erro);
    }
  }, [paginaAtual]);

  useEffect(() => {
    setNome(localStorage.getItem("@gesimo:nome") || "Usuário");
    carregarLocadores();
  }, [carregarLocadores]);

  useEffect(() => {
    localStorage.setItem("@gesimo:menuAberto", JSON.stringify(menuAberto));
  }, [menuAberto]);

  const lidarComMudancaDePagina = (novaPagina) => setPaginaAtual(novaPagina);

  const botaoNovoLocador = (
    <Button variant="primary" icon={Plus} onClick={() => setModalAberto(true)}>
      Novo Locador
    </Button>
  );

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} nome={nome} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nome} />

        <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Locadores</h1>
            <p className="text-gray-500 text-sm">Gerencie os locadores cadastrados.</p>
          </div>

          <DataTable
            colunas={colunasDaTabela}
            dados={locadores}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onPageChange={lidarComMudancaDePagina}
            placeholderBusca="Buscar por nome ou por CPF"
            botaoAcao={botaoNovoLocador}
            onSearch={(termo) => console.log("Buscando por:", termo)}
          />

          <div className="flex-1"></div>
          <Footer />
        </main>
      </div>

      <ModalContainer
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Locador"
      >
        <FormularioLocador
          onClose={() => setModalAberto(false)}
          onSuccess={() => carregarLocadores()}
        />
      </ModalContainer>
    </div>
  );
}