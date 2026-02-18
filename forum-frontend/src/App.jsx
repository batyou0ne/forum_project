import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/createPost";



import DotGrid from './components/DotGrid';

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
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none"
      }}>
        <DotGrid
          dotSize={5}
          gap={25}
          baseColor="#cbd5e1"
          activeColor="#4f46e5"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>


      {isLoggedIn && (
        <nav>
          <div>
            <Link to="/">Anasayfa</Link>
            <Link to="/create">Yeni Gönderi Paylaş</Link>
          </div>
          <button onClick={handleLogout}>Çıkış Yap</button>
        </nav>
      )}

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