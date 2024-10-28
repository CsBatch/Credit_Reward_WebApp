import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: any; // Custom property to store user info after verifying the token
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): any => {
    const token = req.header('Authorization');
    console.log("req.header('Authorization') = ", req.header('Authorization'))
    console.log("token: ", token)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        console.log(token)
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded; // Store user data in request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token' });
    }
};
