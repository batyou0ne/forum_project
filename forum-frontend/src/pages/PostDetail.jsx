
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    
    if(!token) return null;

    try {
        const base64url = token.split(`.`)[1];
        const base64 = base64url.replace(/-/g, `+`).replace(/_/g, `/`);
        const jsonPayload = decodeURIComponent(window.atob(base64).split(``).map(function(c) {
            return `%` + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Token çözülemedi", error);
        return null;
    }

};

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const user = getUserFromToken();
        setCurrentUser(user);

        const fetchPost = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `https://forum-project-batu.onrender.com/api/posts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.message || "Post not found");
                }

                const data = await response.json();
                console.log("GELEN POST:", data);
                setPost(data);

            } catch (err) {
                console.error("Post alınırken hata:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handDelete = async () => {
        if (!window.confirm("Bu postu silmek istediğinden emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://forum-project-batu.onrender.com/api/posts/${id}`,{
                method : "DELETE",
                headers : {
                    Authorization : `Bearer ${token}`
                },
            })

            if(response.ok){
                alert("Post başarıyla silindi.");
                navigate("/");
            } else{
                const data = await response.json();
                alert(data.message || "Silme işlemi başarısız.")
            }
        } catch (error) {
            console.error("Silme hatası", error);
            alert("Bir hata oluştu");
        }
    };

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post bulunamadı :(</p>;

    const canDelete = currentUser && (currentUser.id == post.user_id || currentUser.role === 'admin');

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Yazar:</strong> {post.username}</p>
            <p><small>{new Date(post.created_at).toLocaleDateString()}</small></p>

            <hr />

            {canDelete && (
                <button
                    onClick = {handDelete}
                    className="delete-btn"
                >Post'u sil</button>
            )}
        </div>
    );
}

export default PostDetail;
