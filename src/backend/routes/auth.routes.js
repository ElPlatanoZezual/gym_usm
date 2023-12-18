const express = require("express");
const router = express.Router();

const authMiddleware = require("../authMiddleware");
const authController = require("../controllers/auth.controller");


// Auth routes

router.post("/login",
    authController.login
)

router.post("/signup",
    authController.signup
)

router.get("/logout",
    authController.logout
)

router.get("/getUserData",
    authController.getUserData
)


module.exports = router;