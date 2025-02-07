import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressTable from '../../components/progress/progress';
import Filter from '../../components/progress/filter';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário não estiver autenticado, redireciona para a página de login
    if (!isAuthenticated) {
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-container">
      <h1>Bem-vindo à Home!</h1>
      <p>Você está autenticado e agora na página inicial.</p>
      <ProgressTable/>
    </div>
  );
};

export default Home;
