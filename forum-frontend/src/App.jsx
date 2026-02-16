import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/createPost";


import Aurora from "./components/Aurora";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="container">
      {isLoggedIn && (
        <nav style={{ padding: "10px", backgroundColor: "#eee", marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "10px" }}>Anasayfa</Link>
          <Link to="/create" style={{ marginRight: "10px" }}>Yeni Yazı Yaz</Link>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Posts /> : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />

        <Route path="/register" element={<Register />} />

        <Route 
          path="/create" 
          element={
            isLoggedIn ? <CreatePost /> : <Login onLogin={() => setIsLoggedIn(true)} />
          } 
        />

        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </div>
  );
}

export default App;
