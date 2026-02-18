import { useState } from "react";
import { Link } from "react-router-dom";

import CircularText from '../components/CircularText';
import SplitText from "../components/SplitText";

import API_URL from "../config";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed!");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      onLogin();

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit}>
        <CircularText
          text="WELCOME TO -DAILY CHATS- "
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />

        <button class="cta">
          <span>Login</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>


        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Hesabın yok mu? <Link to="/register">Hemen Kayıt Ol</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
