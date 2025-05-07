import bcrypt from 'bcrypt';
import { db } from '../lib/db.js';
import { UserRole } from '../generated/prisma/index.js';
import jwt from 'jsonwebtoken';

// Create user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await db.user.findUnique({
            where: {
                email
            },
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await db.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: UserRole.USER,
            },
        });

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(201).json({
            sucess: true,
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                image: newUser.image,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            sucess: true,
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const verifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await db.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            sucess: true,
            message: "Email verified successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
        });

        return res.status(200).json({
            sucess: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const checkUser = async (req, res) => {
    try {
        res.status(200).json({
            sucess: true,
            message: "User is authenticated successfully",
            user: req.user,
        });

    } catch (error) {      
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    registerUser,
    loginUser,
    verifyEmail,
    logoutUser,
    checkUser,
};