const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.registerUser(username, email, password);

    res.status(201).json(result);

  } catch (error) {
    console.error("Kayıt Hatası:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      let statusCode = 400;
      if (error.message === "Sunucu hatası oluştu.") statusCode = 500;
      res.status(statusCode).json({ message: error.message });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Giriş başarılı!",
      token: result.token,
      userId: result.userId,
      user: result.user
    });

  } catch (error) {
    console.error("Login Hatası:", error);

    if (error.message === "Kullanıcı bulunamadı veya şifre yanlış.") {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Sunucu hatası." });
  }
};