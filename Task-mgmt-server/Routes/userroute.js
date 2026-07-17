const express = require("express");
const router = express.Router();
const uploadImage = require('../middleware/multer')
const {
  registerUser,
  
  login1,
  getUserInfo,
  loginUser,
  getAllUsers,
  updateUser,
  changePassword,
 
} = require("../controllers/usercontroller");
const {auth} = require("../middleware/auth");

// Register User
router.post("/register",uploadImage.single('profile'), registerUser);

// Login User
router.post("/login", loginUser);


// Get User Information
router.get("/userinfo/:id", auth,  getUserInfo);
router.get("/getall", auth, getAllUsers);

router.put('/update/:id', uploadImage.single('profile'), updateUser);

router.put('/change-password', auth, changePassword);



module.exports = router;