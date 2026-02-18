import React, { useState, useEffect } from "react";
import API_URL from "../config";

const Profile = ({ isOpen, onClose, onLogout }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return; // Only fetch when open

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
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 999,
                        cursor: "pointer"
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "20%",
                minWidth: "300px",
                height: "100vh",
                backgroundColor: "hsla(263, 74%, 89%, 0.63)",
                backdropFilter: "blur(15px)",
                color: "#e0e0e0",
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.3s ease-in-out",
                zIndex: 1000,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
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
                                backgroundColor: "rgba(79, 70, 229, 0.8)",
                                color: "white",
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
                            <p style={{ opacity: 0.9, fontSize: "0.9rem" }}>{userInfo.email}</p>
                        </div>

                        <div style={{ flex: 1, overflowY: "auto" }}>
                            {/* Future: User Posts or Stats */}
                            <p style={{ textAlign: "center", fontStyle: "italic", opacity: 0.5 }}>
                                Henüz biyografi yok.
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