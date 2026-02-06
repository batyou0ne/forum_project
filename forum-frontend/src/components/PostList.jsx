import { useEffect, useState } from "react";

function PostList() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("https://forum-project-batu.onrender.com/api/posts", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Postlar alınamadı");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Posts:", data);
                setPosts(data);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, []);

    if (error) {
        return <p>{error}</p>;
    }
    return (
        <div>
            <h2>Postlar</h2>

            {posts.length === 0 && <p>Post yok</p>}

            {posts.map((post) => (
                <div key={post.id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </div>
            ))}
        </div>
    );
}

export default PostList;


