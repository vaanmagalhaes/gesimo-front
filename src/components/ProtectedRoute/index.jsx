import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isTokenValid } from '../../utils/auth';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('@gesimo:token');
  const location = useLocation();

  if (!token || !isTokenValid(token)) {
    // Redireciona para o login e passa a mensagem via state
    return <Navigate to="/" state={{ mensagem: "Por favor efetue o login" }} replace />;
  }

  return children;
}
