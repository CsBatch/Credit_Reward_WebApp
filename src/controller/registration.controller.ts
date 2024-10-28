import { Request, Response } from 'express';
import { User } from '../modals/registration.modals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { blacklistToken } from '../middleware/jwtAuthentication.middleware';



// -----------------------Registration Endpoint---------------------------------
export const register = async (req: Request, res: Response): Promise<any> => {
    const { FirstName, LastName, PhoneNumber, Email, Password, Address, DateOfBirth, SSN, AnnualIncome, SecurQue1, SecurAns1, SecurQue2, SecurAns2 } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            const hashPassword = await bcrypt.hash(Password, 10);
            const newUser = new User({ FirstName, LastName, PhoneNumber, Email, Password: hashPassword, Address, DateOfBirth, SSN, AnnualIncome, SecurQue1, SecurAns1, SecurQue2, SecurAns2 });
            await newUser.save();
            return res.status(201).json({ message: 'Rgistration Successfull' });
        }
        else {
            return res.status(400).json({ mesage: "User already exists." })
        }
    } catch (error: any) {
        return res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
};


// -----------------------Login Endpoint---------------------------------
export const login = async (req: Request, res: Response): Promise<any> => {
    const { Email, Password } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user || !(await bcrypt.compare(Password, user.Password))) {
            return res.status(401).json({ message: 'User not exist' })
        }
        else {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
            return res.json({ token });
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};



// -----------------------Forget Password Endpoint---------------------------------
export const forgetPassword = async (req: Request, res: Response): Promise<any> => {
    const { Email, SecurQue, SecurAns } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: 'User not exist' })
        }
        else {
            if (SecurQue === user.SecurQue1) {
                if (SecurAns === user.SecurAns1) {
                    return res.status(200).json({ message: 'Check email for reset link' })
                }
            }
            else if (SecurQue === user.SecurQue2) {
                if (SecurAns === user.SecurAns2) {
                    return res.status(200).json({ message: 'Check email for reset link' })
                }
            }
            else {
                return res.status(401).json({ message: 'Incorrect' })
            }
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};



export const resetPassword = async (req: Request, res: Response): Promise<any> => {
    const { Email, Password } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: 'User not exist' })
        }
        const hashPassword = await bcrypt.hash(Password, 10);
        user.Password = hashPassword
        await user.save();
        return res.status(200).json({ message: "Password updated" });
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};



export const deleteAccount = async (req: Request, res: Response): Promise<any> => {
    const { Email } = req.body;
    try {
        if(await User.findOneAndDelete({ Email })){
            return res.status(200).json({ message: 'Account deleted successfully' });
        }
        else{
            return res.status(400).json({ message: 'User Does not exist' });
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};



export const logout = async (req: Request, res: Response): Promise<any> => {

    console.log("inside logout .. ")
    const token = req.header('Authorization');
    console.log("token ..", token)

    try {
        if (token) {
            blacklistToken(token); // Add token to the blacklist
        }
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};