import { useState } from "react";
import { useNavigate } from "react-router-dom";

function createPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://forum-project-batu.onrender.com/api/posts",{
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                },

                body: JSON.stringify({title,content})
            });

            if(response.ok) {
                alert("Post başarıyla oluşturuldu!");
                navigate("/");
            }else{
                alert("Bir hata oluştu!")
            }


        } catch (error) {
            console.error("Hata: ", error)
        }
    }
    return (
        <div>
            <h2>Yeni Gönderi Oluştur</h2>
            
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
