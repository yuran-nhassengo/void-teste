import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/context/AuthContext'; 
import Login from './pages/login/login'; 
import Home from './pages/home/home'; 
import ProtectedRoute from './components/ProtectedRoute'; 

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rota padrão que redireciona para o login se o usuário não estiver autenticado */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota protegida para Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
