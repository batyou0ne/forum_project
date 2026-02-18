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

                const response = await fetch(`${API_URL}/users/profile`, {
                    headers: { authorization: `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data.userInfo);
                    setUserPosts(data.userPosts);
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
                backgroundColor: "#1e1e1e", // Dark theme background
                color: "#e0e0e0",
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.3s ease-in-out",
                zIndex: 1000,
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "-5px 0 15px rgba(0,0,0,0.5)"
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
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <div style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                backgroundColor: "#4f46e5",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                margin: "0 auto 15px"
                            }}>
                                {userInfo.username?.charAt(0).toUpperCase()}
                            </div>
                            <h3>@{userInfo.username}</h3>
                            <p style={{ opacity: 0.7 }}>{userInfo.email}</p>
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

                <button
                    onClick={onLogout}
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem",
                        marginTop: "auto"
                    }}
                >
                    Çıkış Yap
                </button>
            </div>
        </>
    );
};

export default Profile;