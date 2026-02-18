const express = require("express");
const router = express.Router();


const userController = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");

router.get("/profile", auth, userController.getUserProfile);

module.exports = router;

