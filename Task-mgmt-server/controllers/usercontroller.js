const { where } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('../models/usermodel')
const bcryptjs = require("bcryptjs");
const jwt=require('jsonwebtoken')


const registerUser = async (req, res) => {
    try {
        const { name, email, password, contactNumber } = req.body;

        // Check if user already exists
        const existUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existUser) {
            return res.status(400).send({
                success: false,
                msg: "User already exists"
            });
        }

        // Generate Salt
        const salt = bcryptjs.genSaltSync(10);

        // Hash Password
        const hashedPassword = bcryptjs.hashSync(password, salt);

        // Create User
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            contactNumber
        });

        return res.status(201).send({
            success: true,
            msg: "User registered successfully",
            data: newUser
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
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

        // 💡 मुख्य बदल: फ्रंटएंडसाठी टोकनसोबत रोल, आयडी आणि नाव पाठवले!
        return res.status(200).send({
            msg: "Logged in successfully",
            success: true,
            token,
            role: existingUser.role,      // 👈 हा रोल फ्रंटएंडला जाईल (admin/user)
            userId: existingUser.id,      // 👈 हा युझर आयडी जाईल
            name: existingUser.name       // 👈 हे नाव जाईल
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

        res.status(200).send({loggedUser:loggedUser,success:true})

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

module.exports={
    registerUser,
    loginUser,
    getUserInfo,
    getAllUsers
}