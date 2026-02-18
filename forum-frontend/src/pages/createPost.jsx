import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function createPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                alert("Post başarıyla oluşturuldu!");
                navigate("/");
            } else {
                const data = await response.json();
                setError(data.message || "Bir hata oluştu!");
            }


        } catch (error) {
            console.error("Hata: ", error);
            setError("Sunucuya bağlanılamadı.");
        }
    }
    return (
        <div>
            <h2>Yeni Gönderi Oluştur</h2>

            {error && (
                <p style={{ color: "#ef4444", marginBottom: "12px", fontWeight: 500 }}>
                    ⚠️ {error}
                </p>
            )}

            {/* Form gönderilince handleSubmit çalışsın */}
            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: "10px" }}>
                    <label>Başlık:</label><br />
                    <input
                        type="text"
                        value={title}
                        // Yazı değiştikçe state'i güncelle:
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>İçerik:</label><br />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows="5"
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" style={{ padding: "10px 20px" }}>
                    Paylaş
                </button>

            </form>
        </div>
    );
}



export default createPost;
