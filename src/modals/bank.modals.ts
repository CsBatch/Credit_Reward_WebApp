import mongoose, { Schema, Document } from 'mongoose';

interface ICards {
    CardName: string;
    MembershipFee: number;
    CreditCardProcessingFee: number;
    BankSpendingRequirement: number;
    WelcomeBonus: number;
    GiftToYou: string;
    Link: string;
    AdditionalInfo: string;
    Subscribers: Number
}

export interface IBank extends Document {
    BankName: string;
    ActiveStatus: boolean;
    BankCards: ICards[];
}

const bankCardSchema: Schema = new Schema<ICards>({
    CardName: { type: String, required: true },
    MembershipFee: { type: Number, required: true },
    CreditCardProcessingFee: { type: Number, required: true },
    BankSpendingRequirement: { type: Number, required: true },
    WelcomeBonus: { type: Number, required: true },
    GiftToYou: { type: String, required: true },
    Link: { type: String, required: true },
    AdditionalInfo: { type: String, required: true },
    Subscribers: { type: Number }
})

const bankSchema: Schema = new Schema<IBank>({
    BankName: { type: String, required: true },
    ActiveStatus: { type: Boolean, required: true },
    BankCards: [bankCardSchema]
});
export const Bank = mongoose.model<IBank>('Bank', bankSchema);