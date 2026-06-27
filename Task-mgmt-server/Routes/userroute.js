const express = require("express");
const router = express.Router();

const {
  registerUser,
  
  login1,
  getUserInfo,
  loginUser,
  getAllUsers,
 
} = require("../controllers/userController");
const {auth} = require("../middleware/auth");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);


// Get User Information
router.get("/userinfo/:id", auth,  getUserInfo);
router.get("/getall", auth, getAllUsers);
// // Update User Profile
// router.put("/updateprofile/:id", updateProfile);

module.exports = router;