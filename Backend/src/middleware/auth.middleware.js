import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - no token provided",
            });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Unauthorized - invalid token",
            });
        }

        const user = db.user.findUnique({
            where: {
                id: decodedToken.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "Unauthorized - user not found"
            });
        }
            req.user = user;
            next();

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export default authMiddleware;

export const CheckAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                role: true
            },
        });

        if(!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Forbidden - Access denied only user admin",
            });
        }
        next(); // Call next()
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}