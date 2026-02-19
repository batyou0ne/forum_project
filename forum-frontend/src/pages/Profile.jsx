import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Profile = ({ isOpen, onClose, onLogout }) => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [showPosts, setShowPosts] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                console.log("Fetching profile with token:", token);
                const response = await fetch(`${API_URL}/users/profile`, {
                    headers: { authorization: `Bearer ${token}` }
                });

                console.log("Profile response status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Profile data received:", data);
                    setUserInfo(data.userInfo);
                    setUserPosts(data.userPosts);

                    const userId = data.userInfo.id;
                    const [followersRes, followingRes] = await Promise.all([
                        fetch(`${API_URL}/users/${userId}/followers`),
                        fetch(`${API_URL}/users/${userId}/following`)
                    ]);
                    if (followersRes.ok) setFollowers(await followersRes.json());
                    if (followingRes.ok) setFollowing(await followingRes.json());
                } else {
                    const errorData = await response.json();
                    console.error("Profile fetch failed:", errorData);
                }
            } catch (error) {
                console.error("Profil yüklenemedi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 999,
                        background: "transparent",
                    }}
                />
            )}

            <div style={{
                position: "fixed",
                top: "16px",
                right: "16px",
                bottom: "16px",
                width: "20%",
                minWidth: "300px",
                height: "auto",
                backgroundColor: "hsla(0, 0%, 0%, 0.78)",
                backdropFilter: "blur(15px)",
                color: "#767c89",
                transform: isOpen ? "translateX(0)" : "translateX(calc(100% + 16px))",
                transition: "transform 0.3s ease-in-out",
                zIndex: 1000,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "-5px 0 15px rgba(0,0,0,0.2)",
                borderRadius: "12px",
                border: "1px solid #4e525a",
                opacity: "0.9"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        alignSelf: "flex-end",
                        background: "none",
                        border: "none",
                        color: "#fff",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        marginBottom: "20px"
                    }}
                >
                    ✕
                </button>

                {loading ? (
                    <p>Yükleniyor...</p>
                ) : userInfo ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ textAlign: "center", marginBottom: "30px", marginTop: "40px" }}>
                            <div style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                backgroundColor: "#f5c518",
                                color: "#000",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2.5rem",
                                margin: "0 auto 15px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}>
                                {userInfo.username?.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ fontSize: "1.5rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>@{userInfo.username}</h3>
                            <p style={{ opacity: 0.9, fontSize: "0.9rem", marginBottom: "15px" }}>{userInfo.email}</p>

                            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
                                <div
                                    style={{ textAlign: "center", position: "relative", cursor: "pointer" }}
                                    onMouseEnter={() => setShowFollowers(true)}
                                    onMouseLeave={() => setShowFollowers(false)}
                                >
                                    <span style={{ display: "block", fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>{userInfo.followerCount || 0}</span>
                                    <span style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>Takipçi</span>
                                    {showFollowers && followers.length > 0 && (
                                        <div style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            marginTop: "8px",
                                            minWidth: "160px",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#000",
                                            border: "1px solid #4e525a",
                                            borderRadius: "8px",
                                            padding: "6px 0",
                                            zIndex: 1100,
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#4e525a transparent",
                                        }}>
                                            {followers.map(f => (
                                                <div key={f.id} style={{
                                                    padding: "8px 14px",
                                                    fontSize: "0.85rem",
                                                    color: "#ddd",
                                                    borderBottom: "1px solid rgba(78,82,90,0.4)",
                                                    whiteSpace: "nowrap",
                                                }}>@{f.username}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{ textAlign: "center", position: "relative", cursor: "pointer" }}
                                    onMouseEnter={() => setShowFollowing(true)}
                                    onMouseLeave={() => setShowFollowing(false)}
                                >
                                    <span style={{ display: "block", fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>{userInfo.followingCount || 0}</span>
                                    <span style={{ fontSize: "0.75rem", color: "#9ca3af", textTransform: "uppercase" }}>Takip</span>
                                    {showFollowing && following.length > 0 && (
                                        <div style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            marginTop: "8px",
                                            minWidth: "160px",
                                            maxHeight: "200px",
                                            overflowY: "auto",
                                            backgroundColor: "#000",
                                            border: "1px solid #4e525a",
                                            borderRadius: "8px",
                                            padding: "6px 0",
                                            zIndex: 1100,
                                            scrollbarWidth: "thin",
                                            scrollbarColor: "#4e525a transparent",
                                        }}>
                                            {following.map(f => (
                                                <div key={f.id} style={{
                                                    padding: "8px 14px",
                                                    fontSize: "0.85rem",
                                                    color: "#ddd",
                                                    borderBottom: "1px solid rgba(78,82,90,0.4)",
                                                    whiteSpace: "nowrap",
                                                }}>@{f.username}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto" }}>
                            <div
                                style={{
                                    marginTop: "20px",
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => setShowPosts(true)}
                                onMouseLeave={() => setShowPosts(false)}
                            >
                                <h3 style={{
                                    fontSize: "1.2rem",
                                    textAlign: "center",
                                    borderBottom: "1px solid rgba(255,255,255,0.3)",
                                    paddingBottom: "10px",
                                    marginBottom: "10px"
                                }}>
                                    Postlarım
                                </h3>

                                <div style={{
                                    maxHeight: showPosts ? "250px" : "0",
                                    overflowY: showPosts ? "auto" : "hidden",
                                    overflowX: "hidden",
                                    transition: "max-height 0.3s ease-in-out",
                                    backgroundColor: "rgba(0,0,0,0.3)",
                                    borderRadius: "8px",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#4e525a transparent",
                                }}>
                                    {userPosts.length > 0 ? (
                                        userPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                onClick={() => { navigate(`/posts/${post.id}`); onClose(); }}
                                                style={{
                                                    padding: "10px",
                                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                                    fontSize: "0.9rem",
                                                    color: "#ddd",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    cursor: "pointer",
                                                    transition: "background 0.2s",
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                            >
                                                {post.title}
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{
                                            padding: "10px",
                                            textAlign: "center",
                                            fontSize: "0.8rem",
                                            color: "#aaa"
                                        }}>
                                            Henüz gönderiniz yok.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.5, marginTop: "20px" }}>
                                {userInfo.bio || "Henüz biyografi yok."}
                            </p>
                        </div>

                    </div>
                ) : (
                    <p>Kullanıcı bilgisi bulunamadı.</p>
                )}

                <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
                    <button className="Btn" onClick={onLogout}>
                        <div className="sign">
                            <svg viewBox="0 0 512 512">
                                <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                            </svg>
                        </div>
                        <div className="text">Çıkış</div>
                    </button>
                </div>


            </div>
        </>
    );
};

export default Profile;