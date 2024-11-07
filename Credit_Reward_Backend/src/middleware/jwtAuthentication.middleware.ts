import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
interface AuthenticatedRequest extends Request {
    user?: any;
}
const tokenBlacklist = new Set<string>();
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    if (tokenBlacklist.has(token)) {
        return res.status(403).json({ message: 'Access denied. Token is blacklisted.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
export const blacklistToken = (token: string) => {
    tokenBlacklist.add(token);
};