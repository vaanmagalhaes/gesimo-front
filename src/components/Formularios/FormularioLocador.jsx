// src/components/Formularios/FormularioLocador.jsx
import React, { useState } from "react";
import Button from "../Button";
import { api } from "../../services/api";

export default function FormularioLocador({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [enderecoBloqueado, setEnderecoBloqueado] = useState(false);

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
          },
        }));
        setEnderecoBloqueado(true);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cep") {
      buscarCep(value);
    }

    if (
      ["cep", "logradouro", "numero", "complemento", "bairro", "cidade", "estado"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. Busca o token usando o padrão do seu projeto
    const token = localStorage.getItem("@gesimo:token");

    try {
      // 2. Injeta o token no cabeçalho da requisição POST
      await api.post("/locadores", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar locador:", error);
      alert("Erro ao salvar locador. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  // Classes ajustadas para indicar visualmente se o campo está bloqueado
  const inputClass = "w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all";
  const readOnlyClass = "bg-gray-100 cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form id="form-locador" onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Nome Completo *</label>
          <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>CPF *</label>
          <input required type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength="14" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>E-mail *</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>CEP</label>
            <input type="text" name="cep" value={formData.endereco.cep} onChange={handleChange} className={inputClass} />
          </div>
          <div className="col-span-12 md:col-span-8">
            <label className={labelClass}>Logradouro</label>
            <input type="text" name="logradouro" value={formData.endereco.logradouro} onChange={handleChange} readOnly={enderecoBloqueado} className={`${inputClass} ${enderecoBloqueado ? readOnlyClass : ""}`} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <label className={labelClass}>Número</label>
            <input type="text" name="numero" value={formData.endereco.numero} onChange={handleChange} className={inputClass} />
          </div>
          <div className="col-span-12 md:col-span-8">
            <label className={labelClass}>Complemento</label>
            <input type="text" name="complemento" value={formData.endereco.complemento} onChange={handleChange} className={inputClass} />
          </div>
          <div className="col-span-12 md:col-span-5">
            <label className={labelClass}>Bairro</label>
            <input type="text" name="bairro" value={formData.endereco.bairro} onChange={handleChange} readOnly={enderecoBloqueado} className={`${inputClass} ${enderecoBloqueado ? readOnlyClass : ""}`} />
          </div>
          <div className="col-span-12 md:col-span-5">
            <label className={labelClass}>Cidade</label>
            <input type="text" name="cidade" value={formData.endereco.cidade} onChange={handleChange} readOnly={enderecoBloqueado} className={`${inputClass} ${enderecoBloqueado ? readOnlyClass : ""}`} />
          </div>
          <div className="col-span-12 md:col-span-2">
            <label className={labelClass}>UF</label>
            <input type="text" name="estado" value={formData.endereco.estado} onChange={handleChange} maxLength="2" readOnly={enderecoBloqueado} className={`${inputClass} ${enderecoBloqueado ? readOnlyClass : ""}`} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button type="submit" variant="primary" disabled={loading}>{loading ? "Salvando..." : "Salvar Locador"}</Button>
      </div>
    </form>
  );
}