import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../pages/context/AuthContext'; // Importa o hook de autenticação

// Componente para proteger rotas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  console.log("Chegou no protected")

  // Se o usuário não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children; // Se o usuário estiver autenticado, exibe o conteúdo da rota protegida
};

export default ProtectedRoute;
