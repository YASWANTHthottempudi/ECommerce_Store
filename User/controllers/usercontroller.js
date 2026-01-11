const userModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
}

const userRegister = async (req, res) => {
    try {
        const { email, password, firstName, lastName, age, phone, gender } = req.body;

        // Validation
        if (!email || !password || !firstName || !lastName || !age || !phone) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const foundUser = await userModel.findOne({ email: email });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            phone,
            gender
        });

        res.status(201).json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
  
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign(
                {
                    user: {
                        email: user.email,
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        age: user.age,
                        phone: user.phone,
                        gender: user.gender
                    },
                },
                process.env.ACCESS_TOKEN,
                { expiresIn: "1h" }
            );
            res.status(200).json({ token: accessToken });
        } else {
            res.status(401).json({ message: "Wrong email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
};

module.exports = {
    getUser,
    userRegister,
    loginUser
}