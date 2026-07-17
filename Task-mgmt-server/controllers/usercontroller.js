const { where } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('../models/usermodel')
const bcryptjs = require("bcryptjs");
const jwt=require('jsonwebtoken')

const registerUser = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;

    const existUser = await User.findOne({
      where: { email }
    });

    if (existUser) {
      return res.status(400).send({
        success: false,
        msg: "User already exists"
      });
    }

    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    const profile = req.file ? req.file.filename : null;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNumber,
      profile
    });

    res.status(201).send({
      success: true,
      msg: "User registered successfully",
      data: newUser
    });

  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      msg: "Server Error"
    });
  }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({
            where: { email }
        });

        if (!existingUser) {
            return res.status(401).send({
                msg: "User does not exist",
                success: false
            });
        }

        const isPassCorrect = await bcryptjs.compare(
            password,
            existingUser.password
        );

        if (!isPassCorrect) {
            return res.status(401).send({
                msg: "Invalid credentials",
                success: false
            });
        }

        const token = jwt.sign(
            {
                id: existingUser.id,
                role: existingUser.role,
                email: existingUser.email,
                name: existingUser.name
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "2h"
            }
        );

        
        return res.status(200).send({
            msg: "Logged in successfully",
            success: true,
            token,
            role: existingUser.role,      
            userId: existingUser.id,      
            name: existingUser.name       
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: "Server error",
            success: false
        });
    }
};

const getUserInfo = async (req, res) => {
 try{
        console.log("************", req.user)
        const loggedUser =  await User.findByPk(req.user.id,{
            attributes:{exclude:["password", "createdAt","updatedAt"]}
        })

        res.status(200).send({
    ...loggedUser.toJSON(), 
    success: true 
});
        } catch (error) {
        res.status(500).send({msg:"Server error", success:false})
    }
};

async function getAllUsers(req, res) {
  try {
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email']
    });
    return res.status(200).json(users); 
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({ msg: "Server error while fetching users", success: false });
  }
}


async function updateUser(req, res) {
    const ID = req.params.id;
    try {
        const user = await User.findByPk(ID);
        
        if (!user) {
            return res.status(404).send({ msg: "User not found", success: false });
        }

       
        let updateData = {
            name: req.body.name,
            email: req.body.email,
            contactNumber: req.body.contactNumber
        };

        if (req.file) {
            updateData.profile = req.file.filename; // multer मधून येणारे फाइल नाव
        }

        await user.update(updateData);
        res.status(200).send({ msg: "Profile updated successfully", success: true, user: user });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({ msg: "Server error", success: false });
    }
}

async function changePassword(req, res) {
    try {
        const userId = req.user.id; // token मधून येतो (auth middleware मुळे)
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).send({
                msg: "Old password and new password are required",
                success: false
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send({ msg: "User not found", success: false });
        }

        const isOldPassCorrect = await bcryptjs.compare(oldPassword, user.password);

        if (!isOldPassCorrect) {
            return res.status(401).send({
                msg: "Old password is incorrect",
                success: false
            });
        }

        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(newPassword, salt);

        await user.update({ password: hashedPassword });

        res.status(200).send({
            msg: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).send({ msg: "Server error", success: false });
    }
}



module.exports={
    registerUser,
    loginUser,
    getUserInfo,
    getAllUsers,updateUser,
    changePassword
}