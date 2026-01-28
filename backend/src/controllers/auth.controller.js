const userModel = require('../models/user.model')
const foodPartnermodel = require('../models/foodPartner.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


async function registerUser(req, res){
    const {fullname, email, password} = req.body
    
    const isUseralreadyExists = await userModel.findOne({
        email
    })

    if(isUseralreadyExists){
        return res.status(400).json({
            messege: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullname,
        email,
        password : hashedPassword
    })

   const token = jwt.sign({
      id: user._id,
   }, process.env.JWT_SECRET)

   res.cookie("token", token)

   res.status(201).json({
     messege: "User registered successfully",
     user:{
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
     }
   })

}

async function loginUser(req, res){
      
    const {email, password} = req.body

    const user = await userModel.findOne({
        email
    })

    if(!user){
        return res.status(401).json({
            messege: "invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
       return res.status(401).json({
         messege: "invalid email or password"
       })
    }

    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    
    res.status(200).json({
        messege: "User logged in successfully",
        user:{
             _id: user._id,
             email: user.email,
             fullname: user.fullname

        }
    })

}

async function logoutUser(req, res){
     res.clearCookie("token");
     res.status(200).json({
        messege: "User logged out successfully"
     })
}

async function  registerFoodPartner(req, res){
      
    const {fullname, businessname, email, phone, password} = req.body

    const isAccountAlreadyExists = await foodPartnermodel.findOne({
        email
    })

    if(isAccountAlreadyExists) {
        return res.status(400).json({
            messege: "Food partner account already exists"
        })
    }
    
    const hashedPassword  = await bcrypt.hash(password, 10)

    const foodPartner = await foodPartnermodel.create({
       fullname,
       businessname,    
       phone,
       email,
       password: hashedPassword
    })

    const token  = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        messege: "Food partner registered successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            fullname: foodPartner.fullname,
            businessname: foodPartner.businessname,
            phone: foodPartner.phone
        }
    })
}

async function loginFoodPartner(req, res){

    const {email, password} = req.body

    const foodPartner = await foodPartnermodel.findOne({
        email
    })

    if(!foodPartner){
        return res.status(400).json({
            messege: "Invalid email or password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password)

    if(!isPasswordValid){
        return res.status(400).json({
            messege: "Invalid email or password"
        })
    }

    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        messege: "Food partner logged in successfully",
        foodPartner:{
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
}

async function logoutFoodPartner(req, res){
    res.clearCookie("token")
    res.status(200).json({
        messege: "food partner logged out successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}