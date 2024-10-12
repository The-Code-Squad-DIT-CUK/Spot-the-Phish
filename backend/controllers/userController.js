const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken")

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, semester, phoneNo, enrollmentNo } = req.body;

    const userExists = await User.findOne({
        $or: [{ email }, { name }]
    });
    if (userExists) {
        return res.status(404).json({ message: "User already exists" });
    }
    const lastUser = await User.findOne({}, {}, { sort: { 'sequentialId': -1 } });
    const sequentialId = lastUser ? lastUser.sequentialId + 1 : 0;

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.create({
        name,
        semester,
        phoneNo,
        enrollmentNo,
        email,
        password: secPassword,
        sequentialId,

    })

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "No user Exists" });
    }

    const pwdCompare = await bcrypt.compare(req.body.password, user.password)
    if (!pwdCompare) {
        return res.status(404).json({ message: "Incorrect Password" });
    }

    if (user && pwdCompare) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }


});

const getProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // console.log("User data from database:", user); // Add this line
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getSequentialIdProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ sequentialId: req.params.sequentialId }).populate('team');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const adminRegister = asyncHandler(async (req, res) => {
    const { email, name, password, specialCode } = req.query;

    // Validate the special code
    if (specialCode !== process.env.ADMIN_SECRET_CODE) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin' // Set role to admin
        });

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: generateToken(admin._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'No user exists' });
        }

        user.name = name || user.name;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(password, salt);
            user.password = secPassword;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const userScoreboard = asyncHandler(async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).sort({ points: -1 });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = { registerUser, authUser, adminRegister, getProfile, updateUser, getUsers, userScoreboard, getSequentialIdProfile }