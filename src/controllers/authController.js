const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields required!" })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
        INSERT INTO users (username, email, password)
        VALUES(?, ?, ?)
    `
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message })
        }

        res.status(201).json({ message: "User registered successfully" });
    });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.query(sql, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { id: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error });
  }
};
