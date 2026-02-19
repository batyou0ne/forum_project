import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/createPost";
import Profile from "./pages/Profile";
import Orb from './components/orb';

function NavSearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    const q = searchInput.trim();
    if (q) {
      navigate(`/?search=${encodeURIComponent(q)}&page=1`);
    } else {
      navigate(`/?page=1`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div
      className={`nav-search-box ${isSearchFocused ? "focused" : ""}`}
      onMouseEnter={() => setIsSearchFocused(true)}
      onMouseLeave={() => { if (document.activeElement?.className !== "nav-search-input") setIsSearchFocused(false); }}
    >
      <input
        type="text"
        className="nav-search-input"
        placeholder="Post ara..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
      />
      <button className="nav-search-btn" onClick={handleSearch} tabIndex={-1}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}

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
      {!isLoggedIn && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}>
          <Orb
            hoverIntensity={0.14}
            rotateOnHover={false}
            hue={206}
            forceHoverState={false}
            backgroundColor="#000000"
          />
        </div>
      )}

      {isLoggedIn && (
        <nav style={{ position: 'relative', zIndex: 20 }}>
          <div>
            <Link to="/">Anasayfa</Link>
            <Link to="/create">Yeni Gönderi Paylaş</Link>
          </div>

          <NavSearchBar />


          <button
            onClick={() => setIsProfileOpen(true)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f5c518",
              color: "#000",
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