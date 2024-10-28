import { Request, Response } from 'express';
import { User } from '../modals/registration.modals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response): Promise<any> => {

    const { FirstName, LastName, PhoneNumber, Email, Password, Address, DateOfBirth, SSN, AnnualIncome, SecurQue1, SecurAns1, SecurQue2, SecurAns2 } = req.body;

    try {
        console.log("request at register function inside try");
        const user = await User.findOne({ Email });
        if (!user) {
            console.log("request at user not found");
            const hashPassword = await bcrypt.hash(Password, 10);
            const newUser = new User({ FirstName, LastName, PhoneNumber, Email, Password: hashPassword, Address, DateOfBirth, SSN, AnnualIncome, SecurQue1, SecurAns1, SecurQue2, SecurAns2, AccountStatus: true });
            await newUser.save();
            console.log("Registration successfull");
            return res.status(201).json({ message: 'Rgistration Successfull' });
        }
        else {
            console.log("user already exist");
            return res.status(400)
        }
    } catch (error) {
        return res.status(501).json({ error: 'Failed to register user' });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { Email, Password } = req.body;
    console.log("request at login");
    try {
        console.log("request in try");
        const user = await User.findOne({ Email });
        if (!user || !(await bcrypt.compare(Password, user.Password))) {
            return res.status(401).json({ message: 'User not exist' })
        }
        else {
            console.log("login successfull");
            const token = jwt.sign({ userId: user._id }, process.env.MONGO_URI || 'secret');
            console.log(token)
            return res.json({ token });
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};


export const forgetPassword = async (req: Request, res: Response): Promise<any> => {
    const { Email, SecurQue, SecurAns } = req.body;
    console.log("request at login");
    try {
        console.log("request in try");
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: 'User not exist' })
        }
        else {
            if(SecurQue === user.SecurQue1){
                if(SecurAns === user.SecurAns1){
                    return  res.status(200).json({ message: 'Check email for reset link' })
                }
            }
            else if(SecurQue === user.SecurQue2){
                if(SecurAns === user.SecurAns2){
                    return  res.status(200).json({ message: 'Check email for reset link' })
                }
            }
            else{
                return res.status(401).json({ message: 'Incorrect' })
            }
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};