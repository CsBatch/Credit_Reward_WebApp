import mongoose, { Schema, Document } from 'mongoose';
export interface IUser extends Document {
    Name: string; 
    Email: string;
    Password: string;
}

const adminSchema: Schema = new Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
});
export const Admin = mongoose.model<IUser>('Admin', adminSchema);