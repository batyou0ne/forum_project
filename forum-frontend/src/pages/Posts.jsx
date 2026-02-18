import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../config";
import "./Posts.css";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const url = new URL(`${API_URL}/posts`);
                url.searchParams.set("page", page);
                url.searchParams.set("limit", 15);
                if (search) url.searchParams.set("search", search);

                const response = await fetch(url.toString(), {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                setPosts(data.posts || []);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("FETCH ERROR:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, search]);

    const goToPage = (newPage) => {
        const params = { page: newPage };
        if (search) params.search = search;
        setSearchParams(params);
    };

    return (
        <div>
            {search && (
                <div className="search-active-bar">
                    <span>"<strong>{search}</strong>" için sonuçlar</span>
                    <button
                        className="search-clear"
                        onClick={() => setSearchParams({ page: 1 })}
                    >
                        ✕ Temizle
                    </button>
                </div>
            )}

            <h2>Posts</h2>

            {loading ? (
                <p>Yükleniyor...</p>
            ) : posts.length === 0 ? (
                <p>Sonuç bulunamadı.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <h3>
                            <Link to={`/posts/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p>{post.content.substring(0, 500)}</p>
                    </div>
                ))
            )}

            <div className="pagination">
                <button
                    className="page-btn prev-btn"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                >
                    &lt; Önceki
                </button>

                <span className="page-info">
                    Sayfa {page} / {totalPages}
                </span>

                <button
                    className="page-btn next-btn"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Sonraki &gt;
                </button>
            </div>
        </div>
    );
}

export default Posts;
