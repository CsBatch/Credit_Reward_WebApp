import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    FirstName: string; 
    LastName: string;
    PhoneNumber: string;
    Email: string;
    Password: string;
    Address: string;
    DateOfBirth: Date;
    SSN: number;
    AnnualIncome: number;
    SecurQue1: string;
    SecurAns1: string;
    SecurQue2: string;
    SecurAns2: string;
}
const userSchema: Schema = new Schema({
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    PhoneNumber: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Address: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    SSN: { type: Number, required: true },
    AnnualIncome : { type: Number, required: true },
    SecurQue1: { type: String, required: true },
    SecurAns1: { type: String, required: true },
    SecurQue2: { type: String, required: true },
    SecurAns2: { type: String, required: true },
});
export const User = mongoose.model<IUser>('User', userSchema);