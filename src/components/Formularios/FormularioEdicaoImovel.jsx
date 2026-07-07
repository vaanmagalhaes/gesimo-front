import React, { useState } from "react";
import { api } from "../../services/api";
import Button from "../Button";

export default function FormularioEdicaoImovel({ imovel, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    metragem: imovel?.metragem || '',
    inscricaoIPTU: imovel?.inscricaoIPTU || '',
    inscricaoBombeiro: imovel?.inscricaoBombeiro || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("@gesimo:token");
      
      // O Payload exato como o Swagger exige (tudo como String)
      const payload = {
        metragem: formData.metragem ? String(formData.metragem) : null,
        inscricaoIPTU: formData.inscricaoIPTU ? String(formData.inscricaoIPTU) : null,
        inscricaoBombeiro: formData.inscricaoBombeiro ? String(formData.inscricaoBombeiro) : null
      };

      await api.patch(`/imoveis/${imovel.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onSuccess(); 
      onClose();
    } catch (erro) {
      console.error("Erro ao atualizar imóvel:", erro);
      alert("Erro ao salvar as informações. Verifique o console.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          {/* Note que mudei o type para "text" pois o Swagger aceita coisas como "150m2" */}
          <label className="block text-sm text-gray-700 mb-1">Metragem</label>
          <input 
            type="text" 
            name="metragem" 
            value={formData.metragem} 
            onChange={handleChange} 
            placeholder="Ex: 150m2"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Inscrição IPTU</label>
          <input 
            type="text" 
            name="inscricaoIPTU" 
            value={formData.inscricaoIPTU} 
            onChange={handleChange} 
            placeholder="Ex: IPTU-999888"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Inscrição Bombeiros</label>
          <input 
            type="text" 
            name="inscricaoBombeiro" 
            value={formData.inscricaoBombeiro} 
            onChange={handleChange} 
            placeholder="Ex: BOMB-123"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
          />
        </div>
      </div>
      <div className="pt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
        <Button variant="primary" type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}