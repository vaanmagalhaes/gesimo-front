import React, { useState } from 'react';
import { api } from '../../../services/api';
import Button from '../../Button';

export default function FormularioEdicaoImovel({ imovel, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    area: imovel.area || '',
    banheiros: imovel.banheiros || '',
    vagas: imovel.vagas || '',
    quartos: imovel.quartos || '',
    valorEstimado: imovel.valorEstimado || '',
    iptu: imovel.iptu || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("@gesimo:token");
      // Chamada PUT para atualizar o imóvel específico
      await api.put(`/imoveis/${imovel.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(); // Recarrega a lista
      onClose();
    } catch (erro) {
      console.error("Erro ao atualizar imóvel:", erro);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-700">Área (m²)</label><input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700">Quartos</label><input type="number" name="quartos" value={formData.quartos} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700">Banheiros</label><input type="number" name="banheiros" value={formData.banheiros} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700">Vagas</label><input type="number" name="vagas" value={formData.vagas} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700">Aluguel (R$)</label><input type="text" name="valorEstimado" value={formData.valorEstimado} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
        <div><label className="block text-sm text-gray-700">IPTU (R$)</label><input type="text" name="iptu" value={formData.iptu} onChange={handleChange} className="w-full p-2 border rounded-lg" /></div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" type="submit">Salvar Alterações</Button>
      </div>
    </form>
  );
}