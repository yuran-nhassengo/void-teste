import { useState } from "react";
import { useAuth } from "../context/AuthContext";  // Certifique-se que o caminho está correto
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";  // Usando axios diretamente
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Verificando se os valores de email e password estão corretos
      console.log("Email:", email);
      console.log("Password:", password);
  
      // Enviando a requisição com os dados
      const response = await axios.post(
        "https://sonil-dev.void.co.mz/api/v4/users/login",
        {
          username: email,  // email sendo passado como 'username'
          password: password
        }
      );
    
      // Exibindo a resposta da API para verificar se o login foi bem-sucedido
      console.log("Response data:", response.data);
  
      // Salvando o token no localStorage
      const { token, user } = response.data.data;
      console.log("token",response.data.data.user);
      localStorage.setItem("token", token);  // Usando setItem corretamente para salvar no localStorage
    
      // Chamando a função login do contexto
      login(user,token); 
     let userRole=''
      if (user.type && user.type.length > 0) {
         userRole = user.type[0].trim(); // Usando trim apenas se for uma string
        console.log(userRole);
      } else {
        console.log("Nenhum tipo de usuário encontrado.");
      }

  console.log("Mais um role",userRole);
      // Redirecionamento com base no papel do usuário
      if (userRole ==="superAdmin" || userRole === "super-admin") {
        console.log("admin e ")
        navigate("/home");
      } else if (userRole === "graduated" || userRole === "teacher") {
        navigate("/home");
      }
    } catch (error) {
      // Exibindo erros detalhados
      if (error.response) {
        console.error("Erro na resposta da API:", error.response.data);
        setError(error.response.data.errors?.[0]?.msg || "Erro ao fazer login.");
      } else {
        console.error("Erro no login:", error);
        setError("Erro ao fazer login. Verifique suas credenciais.");
      }
    }
  };
  
  

  return (
    <div>
      <div className="login-container">
        <motion.div
          className="login-form"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2>Bem-vindo ao <span>Void!</span></h2>
          <h3>Faça seu Login para continuar.</h3>

          <form onSubmit={handleSubmit}>
            {/* Campo de E-mail */}
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="text"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Exibindo erros */}
            {error && <p className="error-message">{error}</p>}

            {/* Botão de Login */}
            <div>
              <button type="submit" className="login-button">
                Entrar
              </button>
            </div>

            {/* Links de navegação */}
            <div className="navigation-links">
              <Link to="/forgot-password">Esqueceu sua senha?</Link>
              <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Adicione estilos CSS abaixo */}
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f5f5f5;
        }

        .login-form {
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .login-form h2 {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .login-form h3 {
          font-size: 18px;
          font-weight: 500;
          text-align: center;
          margin-bottom: 20px;
        }

        .login-form label {
          display: block;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .login-form input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .login-button:hover {
          background-color: #0056b3;
        }

        .error-message {
          color: red;
          text-align: center;
          margin-top: 10px;
        }

        .navigation-links {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .navigation-links a {
          color: #007bff;
          text-decoration: none;
        }

        .navigation-links a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
