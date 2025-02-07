import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProgressTable from '../../components/progress/progress';
import Filter from '../../components/progress/filter';
import SectorTable from '../../components/Insumos/sector';

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
    <div className="max-w-xl m-5">
      <h1 className='flex items-center justify-center text-pink-500'>Bem-vindo à Home!</h1>
      <p>Tabela Progress.</p>
      <ProgressTable/>
      <p>Tabela Sectores.</p>
      <SectorTable/>
    </div>
  );
};

export default Home;
