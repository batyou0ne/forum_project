import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API_URL from "../config";
import "./Posts.css";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const inputRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const search = searchParams.get("search") || "";

    useEffect(() => {
        setSearchInput(search);
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");

                const url = new URL(`${API_URL}/posts`);
                url.searchParams.set("page", page);
                url.searchParams.set("limit", 5);
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

    const handleSearch = () => {
        const params = { page: 1 };
        if (searchInput.trim()) params.search = searchInput.trim();
        setSearchParams(params);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="search-wrapper">
                <div
                    className={`search-box ${isSearchFocused ? "focused" : ""}`}
                    onMouseEnter={() => setIsSearchFocused(true)}
                    onMouseLeave={() => { if (document.activeElement !== inputRef.current) setIsSearchFocused(false); }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Post ara..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                    />
                    <button className="search-btn" onClick={handleSearch} tabIndex={-1}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                </div>
                {search && (
                    <p className="search-info">
                        "<strong>{search}</strong>" için sonuçlar
                        <button
                            className="search-clear"
                            onClick={() => { setSearchInput(""); setSearchParams({ page: 1 }); }}
                        >
                            ✕ Temizle
                        </button>
                    </p>
                )}
            </div>

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

            <div style={{ marginTop: 20, display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
                <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "0",
                        padding: "10px 20px",
                        fontSize: "1.1rem",
                        cursor: page === 1 ? "not-allowed" : "pointer",
                        opacity: page === 1 ? 0.5 : 1
                    }}
                >
                    &lt; Önceki
                </button>

                <span style={{ margin: "0 10px", fontWeight: "bold" }}>
                    Sayfa {page} / {totalPages}
                </span>

                <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "0",
                        padding: "10px 20px",
                        fontSize: "1.1rem",
                        cursor: page === totalPages ? "not-allowed" : "pointer",
                        opacity: page === totalPages ? 0.5 : 1
                    }}
                >
                    Sonraki &gt;
                </button>
            </div>
        </div>
    );
}

export default Posts;
