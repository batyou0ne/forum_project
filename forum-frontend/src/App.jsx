import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/createPost";
import SplitText from "./SplitText";

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
        <Aurora
          colorStops={["#446bf2", "#0f1117", "#22c55e"]}
          amplitude={1.2}
          blend={0.5}
          speed={0.5}
        />
      </div>


      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        {isLoggedIn && (
          <nav>
            <div>
              <Link to="/">Anasayfa</Link>
              <Link to="/create">Yeni Gönderi Paylaş</Link>
            </div>
            <button onClick={handleLogout}>Çıkış Yap</button>
          </nav>
        )}

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

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

<SplitText
  text="Hello, you!"
  className="text-2xl font-semibold text-center"
  delay={50}
  duration={1.25}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
  onLetterAnimationComplete={handleAnimationComplete}
  showCallback
/>

export default App;