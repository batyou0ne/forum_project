const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());

app.use(
    cors({
        origin:"http://localhost:5173",
        credentials :true
    })
)

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/comments", require("./routes/commentRoute"));

module.exports = app;