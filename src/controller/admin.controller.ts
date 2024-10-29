import { Request, Response } from 'express';
import { Admin } from '../modals/admin.modals';
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