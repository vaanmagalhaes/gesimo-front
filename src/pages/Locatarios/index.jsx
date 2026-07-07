import React, { useState, useEffect, useCallback } from "react";
import { Plus, Users } from "lucide-react"; // Usando 'Users' para representar locatários
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import DataTable from "../../components/DataTable";
import ModalContainer from "../../components/ModalContainer";
import FormularioLocatario from "../../components/Formularios/FormularioLocatario";

import { api } from "../../services/api";

export default function Locatarios() {
  const [menuAberto, setMenuAberto] = useState(() => {
    const preferenciaSalva = localStorage.getItem("@gesimo:menuAberto");
    return preferenciaSalva !== null ? JSON.parse(preferenciaSalva) : true;
  });

  const [nomeUsuario, setNomeUsuario] = useState("");
  const [locatarios, setLocatarios] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);

  // Colunas espelhando perfeitamente o design do mockup image_eed73b.jpg
  const colunasDaTabela = [
    { key: "nomeExibicao", label: "Nome" },
    { key: "documentoExibicao", label: "CPF/CNPJ" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "Email" },
    { key: "contratos", label: "Contratos" },
    { key: "acoes", label: "Ações" },
  ];

  const carregarLocatarios = useCallback(async () => {
    const token = localStorage.getItem("@gesimo:token");
    
    try {
      const resposta = await api.get(`/locatarios?page=${paginaAtual}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const dadosBrutos = resposta.data.data || resposta.data;

      // Normalizando os dados do Prisma para a exibição limpa na tabela
      const locatariosFormatados = dadosBrutos.map((loc) => {
        const isPF = !!loc.pessoaFisica;
        return {
          ...loc,
          nomeExibicao: isPF ? loc.pessoaFisica.nome : loc.pessoaJuridica?.razaoSocial || "N/A",
          documentoExibicao: isPF ? loc.pessoaFisica.cpf : loc.pessoaJuridica?.cnpj || "N/A",
          contratos: loc.contratosCount, 
        };
      });

      setLocatarios(locatariosFormatados);
      setTotalPaginas(resposta.data.meta?.totalPages || 1);
    } catch (erro) {
      console.error("Erro ao carregar locatários:", erro);
    }
  }, [paginaAtual]);

  useEffect(() => {
    setNomeUsuario(localStorage.getItem("@gesimo:nome") || "Usuário");
    carregarLocatarios();
  }, [carregarLocatarios]);

  useEffect(() => {
    localStorage.setItem("@gesimo:menuAberto", JSON.stringify(menuAberto));
  }, [menuAberto]);

  const botaoNovoLocatario = (
    <Button variant="primary" icon={Plus} onClick={() => setModalAberto(true)}>
      Novo Locatário
    </Button>
  );

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar menuAberto={menuAberto} setMenuAberto={setMenuAberto} nome={nomeUsuario} />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header nome={nomeUsuario} />

        <main className="p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Locatários</h1>
              <p className="text-gray-500 text-sm">Gerencie os locatários cadastrados.</p>
            </div>
          </div>

          <DataTable
            colunas={colunasDaTabela}
            dados={locatarios}
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onPageChange={(nova) => setPaginaAtual(nova)}
            placeholderBusca="Buscar por nome, CPF ou CNPJ"
            botaoAcao={botaoNovoLocatario}
            onSearch={(termo) => console.log("Buscando locatário:", termo)}
          />

          <div className="flex-1"></div>
          <Footer />
        </main>
      </div>

      <ModalContainer
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Locatário"
      >
        <FormularioLocatario onClose={() => setModalAberto(false)} onSuccess={carregarLocatarios} />
      </ModalContainer>
    </div>
  );
}