import { Request, Response } from 'express';
import { Admin } from '../modals/admin.modals';
import { User } from '../modals/registration.modals';
import { Bank } from '../modals/bank.modals';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';




// -----------------------Registration Endpoint---------------------------------

// export const register = async (req: Request, res: Response): Promise<any> => {
//     const { Name, Email, Password} = req.body;
//     try {
//         const admin = await Admin.findOne({ Email });
//         if (!admin) {
//             const hashPassword = await bcrypt.hash(Password, 10);
//             const newadmin = new Admin({ Name, Email, Password: hashPassword });
//             await newadmin.save();
//             return res.status(201).json({ message: 'Rgistration Successfull' });
//         }
//         else {
//             return res.status(400).json({ mesage: "admin already exists." })
//         }
//     } catch (error: any) {
//         return res.status(500).json({ error: 'Failed to register admin', details: error.message });
//     }
// };




// -----------------------Login Endpoint---------------------------------
export const login = async (req: Request, res: Response): Promise<any> => {
    const { Email, Password } = req.body;
    try {
        const admin = await Admin.findOne({ Email });
        if (!admin || !(await bcrypt.compare(Password, admin.Password))) {
            return res.status(401).json({ message: 'admin not exist' })
        }
        else {
            const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET || 'secret');
            return res.json({ token });
        }
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};


export const getAllUser = async (res: Response): Promise<any> => {
    try {
        const user = await User.find();
        if (!user) {
            return res.status(200).json({ message: 'No Users' });
        }
        const userData = user.map((element) => {
            const id = element._id
            const name = element.FirstName + " " + element.LastName
            const email = element.Email
            const phone = element.PhoneNumber
            const status = element.AccountStatus

            return { id, name, email, phone, status }
        })
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};

export const changeUserStatus = async (req: Request, res: Response): Promise<any> => {
    const userId = req.params.id;
    const newStatus = req.body.status;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(200).json({ error: 'Invalid User ID format' });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { AccountStatus: newStatus },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// <----------------------------------- Bank Management ------------------------->
export const addBank = async (req: Request, res: Response): Promise<any> => {
    const BankName = req.body.bankName;
    console.log(BankName)
    try {
        const bank = await Bank.findOne({ BankName });
        if (bank) {
            return res.status(404).json({ error: 'Bank Already Exists' });
        }
        await Bank.insertMany({ BankName, ActiveStatus: true });
        return res.status(200).json({ success: true, bank });
    } catch (error) {
        return res.status(500).json({ error });
    }
}


export const showBank = async (res: Response): Promise<any> => {
    try {
        const bank = await Bank.find();
        if (!bank) {
            return res.status(200).json({ message: 'No banks' });
        }
        
        return res.status(200).json(bank);
    } catch (error) {
        return res.status(501).json({ error: 'Inernal Server Error' });
    }
};

export const removeBank = async (req: Request, res: Response): Promise<any> => {
    const BankName = req.body.bankName;
    console.log(BankName)
    try {
        const bank = await Bank.findOneAndDelete({ BankName });
        return res.status(200).json({ success: true, bank });
    } catch (error) {
        return res.status(500).json({ error });
    }
}



export const changeBankStatus = async (req: Request, res: Response): Promise<any> => {
    const bankId = req.params.id;
    const newStatus = req.body.status;
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
        return res.status(200).json({ error: 'Invalid User ID format' });
    }
    try {
        const updatedBank = await Bank.findByIdAndUpdate(
            bankId,
            { AccountStatus: newStatus },
            { new: true }
        );
        if (!updatedBank) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, bank: updatedBank });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// <----------------------------------- Card Management ------------------------->
export const addCard = async (req: Request, res: Response): Promise<any> => {
    const { BankName, CardName, ...otherInfo } = req.body;

    try {
        const bank = await Bank.findOne({ BankName });
        console.log(bank)
        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' });
        }
        const newCard = { CardName, ...otherInfo, Subscribers: 0 };
        bank.BankCards.push(newCard);
        await bank.save();
        return res.status(200).json({ success: true, bank });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

export const showCard = async (req: Request, res: Response): Promise<any> => {
    const BankName = req.body.bankName;
    try {
        const bank = await Bank.findOne({ BankName });
        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' });
        }
        return res.status(200).json(bank.BankCards);
    } catch (error) {
        return res.status(500).json({ error });
    }
};

export const removeCard = async (req: Request, res: Response): Promise<any> => {
    const BankName = req.body.bankName;
    const CardId = req.params.id;
    try {
        const bank = await Bank.findOne({ BankName });
        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' });
        }
        const cardDelete = await Bank.findOneAndDelete({ _id: CardId });
        bank.save();
        return res.status(200).json({ success: true, cardDelete });
        
    } catch (error) {
        return res.status(500).json({ error });
    }
}


export const changeBankCardStatus = async (req: Request, res: Response): Promise<any> => {
    const bankId = req.params.Bankid;
    const cardId = req.params.Cardid;
    const newStatus = req.body.status;
    if (!mongoose.Types.ObjectId.isValid(bankId)) {
        return res.status(200).json({ error: 'Invalid User ID format' });
    }
    try {
        const bank = await Bank.findOne({bankId});
        if (!bank) {
            return res.status(404).json({ error: 'Bank not found' });
        }
        const updatedCard = await Bank.findOneAndUpdate(
            { _id: cardId },
            { AccountStatus: newStatus },
            { new: true }
        );

        if (!updatedCard) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ success: true, card: updatedCard });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

/*
    FirstName: string;
    LastName: string;
    PhoneNumber: string;
    Email: string;
    Password: string;
    Address: string;
    DateOfBirth: Date;
    SSN: number;
    AnnualIncome: number;
    AccountStatus: boolean;
    SecurQue1: string;
    SecurAns1: string;
    SecurQue2: string;
    SecurAns2: string; 
 */