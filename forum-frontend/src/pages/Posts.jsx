import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem("token");

                const response = await fetch(`http://localhost:3003/api/posts?page=${page}&limit=5`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
    }, [page]);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div>
            <h2>Posts</h2>

            {posts.length === 0 && <p>No posts found</p>}

            {posts.map((post) => (
                <div key={post.id} className="post-card">
                    <h3>
                        <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p>{post.content.substring(0, 500)}</p>
                </div>
            ))}
            <div style={{ marginTop: 20 }}>
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span style={{ margin: "0 10px" }}>
                    Page {page} / {totalPages}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>

        </div>



    );


}

export default Posts;
