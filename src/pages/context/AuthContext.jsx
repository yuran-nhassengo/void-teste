import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';  // Usando axios diretamente
import Cookies from 'js-cookie';

// Definindo os tipos do contexto (em JS, sem tipagem explícita)
const AuthContext = createContext({
  isAuthenticated: false,
  userRole: null,
  username: null,
  userId: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

// Hook para acessar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const access_token = localStorage.getItem('token'); // Pegando o token do localStorage

    if (!access_token) {
      setLoading(false); // Se não houver token, finaliza o loading
      return;
    }

    setIsAuthenticated(true);

    // Se houver token, não vamos verificar com o back-end nesse momento, 
    // já que o login depende da rota específica
    setLoading(false); // Finaliza o loading depois da verificação
  }, []);

  const login = (user,token) => {
    // Fazendo a requisição para autenticar o usuário
        
        // Armazenando o token e informações do usuário nos estados
        setIsAuthenticated(true);
        setUserRole(user.type); // O tipo do usuário
        setUsername(user.fullname); // O nome completo
        setUserId(user.id); // O ID do usuário
        localStorage.setItem("token", token); // Armazenando o token no cookies
   
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    setUserId(null);
    Cookies.remove('token'); // Remover o token do localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
