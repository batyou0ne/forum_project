const express = require("express");
const app = express();
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const followRoute = require("./routes/followerRoute");

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/comments", require("./routes/commentRoute"));

app.use("/api/users", userRoute);

app.use("/api/users", followRoute)

module.exports = app;