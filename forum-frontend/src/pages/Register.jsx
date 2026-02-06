import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();

    const handleRegister = async (e) =>{
        e.preventDefault();

        try {
            const response = await fetch("https://forum-project-batu.onrender.com/api/auth/register",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({username, email, password}),
            });

            const data = await response.json();

            if(response.ok){
                alert("Kayıt başarılı!")
                navigate("/");
            }else{
                alert(data.message || "Kayıt başarısız!")
            }

        } catch (error) {
            console.error("Kayıt hatası:", error);
            alert("Bir hata oluştu.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
            <form onSubmit={handleRegister}>
                <h2>Aramıza Katıl ☁️</h2>
                
                <div style={{ marginBottom: "15px" }}>
                    <label>Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" style={{ width: "100%" }}>Kayıt Ol</button>

                <p style={{ marginTop: "15px" }}>
                    Zaten hesabın var mı? <Link to="/">Giriş Yap</Link>
                </p>
            </form>
        </div>
    );
}


export default Register;