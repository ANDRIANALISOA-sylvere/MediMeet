const express = require("express");
const {
  Register,
  Login,
  GoogleAuth,
} = require("../controllers/User.controller");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  GoogleAuth
);
router.post("/register", Register);
router.post("/login", Login);

module.exports = router;
