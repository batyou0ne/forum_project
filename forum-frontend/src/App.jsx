import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/createPost";
import Profile from "./pages/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsProfileOpen(false);
  };

  return (
    <>
      {isLoggedIn && (
        <nav>
          <div>
            <Link to="/">Anasayfa</Link>
            <Link to="/create">Yeni Gönderi Paylaş</Link>
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}
          >
            P
          </button>
        </nav>
      )}

      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
      />

      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Posts /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={isLoggedIn ? <CreatePost /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </>
  );
}

export default App;