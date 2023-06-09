const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const genereteToken = (id) => {
return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
  
    // Validation  
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill in all requiered fields");
    }
    if (password.length < 6 ){
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }

    // Check if user email already exists
    const userExists = await User.findOne({email});

    if (userExists) {
        res.status(400);
        throw new Error("Email has already been used");
    }
    
    // Encrypt password before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Create new user
    const user = await User.create({
        name:name,
        email:email,
        password:hashedPassword
    });

    // Generate Token
    const token = genereteToken(user._id)

    if (user){
        const {_id, name, email, photo, phone, bio} = user;
        res.status(201).json({
            _id, 
            name, 
            email, 
            photo, 
            phone, 
            bio,
            token
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }

});

module.exports = {
    registerUser
}