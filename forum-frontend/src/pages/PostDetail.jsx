import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../config";
import './PostDetail.css';

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

    // State for follow
    const [isFollowing, setIsFollowing] = useState(false);

    // State for comments
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        try {
            // Correct API URL: /api/comments/:postId
            const response = await fetch(`${API_URL}/comments/${id}`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Yorumlar yüklenirken hata oluştu:", error);
        }
    };

    useEffect(() => {
        const user = getUserFromToken();
        setCurrentUser(user);

        const fetchPost = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");

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

                // Takip durumunu kontrol et
                if (user && user.id !== data.user_id) {
                    try {
                        const followRes = await fetch(`${API_URL}/users/${data.user_id}/followers`);
                        if (followRes.ok) {
                            const followers = await followRes.json();
                            setIsFollowing(followers.some(f => f.id === user.id));
                        }
                    } catch (_) { }
                }

                // Fetch comments after post is loaded
                fetchComments();

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

    const handleAddComment = async (e) => {
        e.preventDefault();

        const currentUserId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Fixed: localStorage.getItem

        if (!currentUserId || !token) {
            alert("Yorum yapmak için giriş yapmalısınız!");
            return;
        }
        if (!newComment.trim()) {
            alert("Boş yorum gönderemezsiniz!");
            return;
        }

        try {
            // Correct API URL: /api/comments/:postId
            const response = await fetch(`${API_URL}/comments/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUserId, // Backend might expect this or extract from token
                    content: newComment
                }),
            });

            if (response.ok) {
                setNewComment(""); // Clear input
                fetchComments(); // Refresh list
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Yorum eklenemedi.");
            }
        } catch (error) {
            console.error("Yorum gönderilemedi:", error);
        }
    };

    const handleReaction = async (postId, type) => {
        if (!currentUser) {
            alert("Like atmak için giriş yapmalısınız!");
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

    const handleFollow = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/users/${post.user_id}/follow`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setIsFollowing(data.following);
            }
        } catch (err) {
            console.error("Takip hatası:", err);
        }
    };

    // ... (imports remain)

    // ...

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <div className="post-meta">
                <p style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span><strong>Yazar:</strong> {post.username}</span>
                    {currentUser && currentUser.id !== post.user_id && (
                        <button
                            onClick={handleFollow}
                            className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`}
                        >
                            {isFollowing ? "Takip Edildi" : "Takip Et"}
                        </button>
                    )}
                </p>
                <p><small>{new Date(post.created_at).toLocaleDateString()}</small></p>
            </div>

            <div className="reaction-container">
                <button
                    onClick={() => handleReaction(post.id, 'like')}
                    className="reaction-btn like"
                >
                    <span>👍</span>{likeCount}
                </button>

                <button
                    onClick={() => handleReaction(post.id, 'dislike')}
                    className="reaction-btn dislike"
                >
                    <span>👎</span> {dislikeCount}
                </button>
            </div>

            <hr />

            {/* Comments Section */}
            <div className="comment-section">
                <h3>Yorumlar</h3>

                {currentUser ? (
                    <form onSubmit={handleAddComment} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Bir yorum yaz..."
                            rows="3"
                        />
                        <button type="submit">Gönder</button>
                    </form>
                ) : (
                    <p>Yorum yapmak için giriş yapmalısınız.</p>
                )}

                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p>Henüz yorum yok. İlk yorumu sen yap!</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="comment-card">
                                <p className="comment-header">
                                    {comment.username || `Kullanıcı ${comment.user_id}`}
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </p>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {canDelete && (
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={handleDelete}
                        className="delete-btn"
                    >Post'u sil</button>
                </div>
            )}
        </div>
    );
}

export default PostDetail;
