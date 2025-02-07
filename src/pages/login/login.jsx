import { useState } from "react";
import { useAuth } from "../context/AuthContext";  
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";  
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);  // Estado para controlar o carregamento
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Ativa o estado de carregamento

    try {
      const response = await axios.post(
        "https://sonil-dev.void.co.mz/api/v4/users/login",
        {
          username: email, 
          password: password
        }
      );

      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      login(user, token); 

      console.log(user);

      let userRole = user.type[0] || '';
      if (userRole && typeof userRole === 'string') {
        userRole = userRole.trim();
      }

      if (userRole === "superAdmin" || userRole === "super-admin") {
        navigate("/home");
      } else if (userRole === "graduated" || userRole === "teacher") {
        navigate("/home");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.errors?.[0]?.msg || "Erro ao fazer login.");
      } else {
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    } finally {
      setLoading(false); // Desativa o estado de carregamento após a requisição
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">Bem-vindo ao <span className="text-pink-500">Void!</span></h2>
        <h3 className="text-center text-gray-600 mb-6">Faça seu Login para continuar.</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exibindo erros */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Botão de Login */}
          <div>
            <button 
              type="submit"
              className="w-full py-3 mt-4 hover:cursor-pointer bg-pink-500 text-white font-semibold rounded-md hover:bg-pink-300 transition duration-300"
              disabled={loading} // Desativa o botão durante o carregamento
            >
              {loading ? 'Enviando...' : 'Entrar'} {/* Exibe 'Enviando...' durante o carregamento */}
            </button>
          </div>

          {/* Links de navegação */}
          <div className="flex justify-between text-sm text-blue-600 mt-4">
            <Link to="/forgot-password" className="hover:text-blue-800">Esqueceu sua senha?</Link>
            <Link to="/cadastro" className="hover:text-blue-800">Não tem uma conta? Cadastre-se</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
