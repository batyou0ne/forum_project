
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../config";

const getUserFromToken = () => {
    const token = localStorage.getItem("token");

    if (!token) return null;

    try {
        const base64url = token.split(`.`)[1];
        const base64 = base64url.replace(/-/g, `+`).replace(/_/g, `/`);
        const jsonPayload = decodeURIComponent(window.atob(base64).split(``).map(function (c) {
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

    // State for likes/dislikes
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    useEffect(() => {
        const user = getUserFromToken();
        setCurrentUser(user);

        const fetchPost = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

                // CHANGE: Use dynamic API_URL
                const response = await fetch(
                    `${API_URL}/posts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token || ""}`,
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
                setLikeCount(data.like_count || 0);
                setDislikeCount(data.dislike_count || 0);

            } catch (err) {
                console.error("Post alınırken hata:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Bu postu silmek istediğinden emin misin?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            if (response.ok) {
                alert("Post başarıyla silindi.");
                navigate("/");
            } else {
                const data = await response.json();
                alert(data.message || "Silme işlemi başarısız.")
            }
        } catch (error) {
            console.error("Silme hatası", error);
            alert("Bir hata oluştu");
        }
    };

    const handleReaction = async (postId, type) => {
        if (!currentUser) {
            alert("Oy vermek için giriş yapmalısınız!");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/posts/${postId}/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ type }), // Backend expects 'type' in body
            });

            if (response.ok) {
                const result = await response.json();
                const action = result.action; // 'added', 'removed', 'updated'

                if (type === 'like') {
                    if (action === 'added') {
                        setLikeCount(prev => prev + 1);
                    } else if (action === 'removed') {
                        setLikeCount(prev => Math.max(0, prev - 1));
                    } else if (action === 'updated') {
                        setLikeCount(prev => prev + 1);
                        setDislikeCount(prev => Math.max(0, prev - 1));
                    }
                } else if (type === 'dislike') {
                    if (action === 'added') {
                        setDislikeCount(prev => prev + 1);
                    } else if (action === 'removed') {
                        setDislikeCount(prev => Math.max(0, prev - 1));
                    } else if (action === 'updated') {
                        setDislikeCount(prev => prev + 1);
                        setLikeCount(prev => Math.max(0, prev - 1));
                    }
                }

            } else {
                const errorData = await response.json();
                alert(errorData.message || "Bir hata oluştu");
            }

        } catch (error) {
            console.error("Tepki gönderilemedi:", error);
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

            <div className="reaction-buttons" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                <button
                    onClick={() => handleReaction(post.id, 'like')}
                    style={{
                        backgroundColor: '#1f2937',
                        color: '#4ade80',
                        border: '1px solid #4ade80',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    <span>👍</span>{likeCount}
                </button>

                <button
                    onClick={() => handleReaction(post.id, 'dislike')}
                    style={{
                        backgroundColor: '#1f2937',
                        color: '#f87171',
                        border: '1px solid #f87171',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 'bold'
                    }}
                >
                    <span>👎</span> {dislikeCount}
                </button>
            </div>

            <hr />

            {canDelete && (
                <button
                    onClick={handleDelete}
                    className="delete-btn"
                >Post'u sil</button>
            )}
        </div>
    );
}

export default PostDetail;
