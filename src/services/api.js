import axios from 'axios';

//Criamos uma instância do Axios apontando para o nosso API Gateway
export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Interceptor para injetar o Token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@gesimo:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});