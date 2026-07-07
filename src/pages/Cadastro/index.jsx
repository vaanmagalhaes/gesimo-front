import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../../services/api";
import estilos from "./cadastro.module.css";
import logo from "../../assets/logo.png";

export default function Cadastro() {
  const navegar = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [idRole, setIdRole] = useState("2"); // Default to USER
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const realizarCadastro = async (evento) => {
    evento.preventDefault();
    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // Validação básica de senha no front-end para evitar requisições desnecessárias
    if (senha.length < 8) {
      setErro("A senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (!/(?=.*[A-Z])/.test(senha)) {
      setErro("A senha deve conter pelo menos uma letra maiúscula.");
      return;
    }
    if (!/(?=.*[^a-zA-Z0-9])/.test(senha)) {
      setErro("A senha deve conter pelo menos um caractere especial.");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await api.post("/usuarios", {
        nome,
        email,
        senha,
        id_role: Number(idRole),
      });

      setSucesso("Usuário criado com sucesso! Redirecionando para o login...");
      setTimeout(() => {
        navegar("/");
      }, 2000);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      if (error.response && error.response.data && error.response.data.message) {
        const mensagens = Array.isArray(error.response.data.message) 
          ? error.response.data.message.join(", ") 
          : error.response.data.message;
        setErro(mensagens);
      } else {
        setErro("Erro ao realizar cadastro. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white">
      {/* Coluna Esquerda: Imagem */}
      <div className={`w-1/2 h-full ${estilos.fundoImagem}`}></div>

      {/* Coluna Direita: Formulário */}
      <div className="w-1/2 h-full flex flex-col justify-center items-center overflow-y-auto py-8">
        <div className="w-full max-w-md px-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="Logo Gesimo" className="w-32 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Criar Conta
            </h1>
            <p className="text-gray-500">Cadastre-se para acessar o sistema</p>
          </div>

          <form onSubmit={realizarCadastro} className="flex flex-col gap-4">
            {/* Input Nome */}
            <div className="flex flex-col">
              <label htmlFor="nome" className="text-sm font-medium text-gray-900 mb-1">
                Nome<span className="text-red-500">*</span>
              </label>
              <input
                id="nome"
                type="text"
                placeholder="João Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Input E-mail */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-900 mb-1">
                Email<span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@gesimo.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
            </div>

            {/* Select Perfil */}
            <div className="flex flex-col">
              <label htmlFor="perfil" className="text-sm font-medium text-gray-900 mb-1">
                Perfil de Usuário<span className="text-red-500">*</span>
              </label>
              <select
                id="perfil"
                value={idRole}
                onChange={(e) => setIdRole(e.target.value)}
                required
                className="px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all bg-white"
              >
                <option value="1">ADMIN</option>
                <option value="2">USER</option>
              </select>
            </div>

            {/* Input Senha */}
            <div className="flex flex-col relative">
              <label htmlFor="senha" className="text-sm font-medium text-gray-900 mb-1">
                Senha<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 8 caracteres, uma letra maiúscula e um caractere especial.
              </p>
            </div>

            {/* Input Confirmar Senha */}
            <div className="flex flex-col relative">
              <label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-900 mb-1">
                Confirmar Senha<span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmarSenha"
                  type={mostrarConfirmarSenha ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={mostrarConfirmarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Mensagens */}
            {erro && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200 text-center">
                {erro}
              </div>
            )}
            {sucesso && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-md border border-green-200 text-center">
                {sucesso}
              </div>
            )}

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={carregando}
              className={`w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 mt-2 ${estilos.botaoEntrar}`}
            >
              {carregando ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link to="/" className="text-blue-600 font-medium hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
