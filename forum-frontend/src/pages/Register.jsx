import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.trim().length === 0) {
            alert("Kullanıcı adı boş bırakılamaz!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Kayıt başarılı!")
                navigate("/");
            } else {
                alert(data.message || "Kayıt başarısız!")
            }

        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    return (
        <div className="auth-page">
            <form onSubmit={handleSubmit}>
                <h2>Aramıza Katıl ☁️</h2>

                <div style={{ marginBottom: "15px" }}>
                    <label>Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]/g, ''))}
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>E-posta</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                        required
                    />
                </div>

                <button type="submit" className="cta" style={{ width: "100%" }}>
                    <span>Kayıt Ol</span>
                    <svg width="15px" height="10px" viewBox="0 0 13 10">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>

                <p style={{ marginTop: "15px" }}>
                    Zaten hesabın var mı? <Link to="/">Giriş Yap</Link>
                </p>
            </form>
        </div>
    );
}


export default Register;