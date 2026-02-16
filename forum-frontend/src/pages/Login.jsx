import { useState } from "react";
import { Link } from "react-router-dom";

import CircularText from './CircularText';
import SplitText from "../components/SplitText";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://forum-project-batu.onrender.com/api/auth/login",
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

      onLogin();

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit}>
        <SplitText
          text="Login"
          tag="h2"
          className=""
          delay={50}
          duration={1.2}
          ease="circ.out"
          splitType="chars,words"
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
        />



        <CircularText
          text="WELCOME TO -DAILY CHATS- "
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />

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
