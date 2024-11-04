import mongoose, { Schema, Document, Types } from 'mongoose';
interface ITransactionDetails {
    Date: Date;
    Amount: number;
    MembershipID: string;
}
interface ICard {
    CardName: string;
    CardHolderName: string;
    CardNumber: string;
    CardType: string;
    ExpiryDate: Date;
    SecurityCode: String;
    BonusReward: number;
    RedemptionStatus: boolean;
    transactionDetails: ITransactionDetails[];
}
export interface ICardDetails extends Document {
    User: Types.ObjectId;  // Updated ObjectId type reference
    Email: string;
    cardDetails: ICard[];
}
const transactionDetailsSchema = new Schema<ITransactionDetails>({
    Date: { type: Date, required: true },
    Amount: { type: Number, required: true },
    MembershipID: { type: String, required: true }
});
const cardSchema = new Schema<ICard>({
    CardName: { type: String, required: true },
    CardHolderName: { type: String, required: true },
    CardNumber: { type: String, unique:true, required: true },
    ExpiryDate: { type: Date, required: true },
    SecurityCode: { type: String, required: true },
    CardType: { type: String },
    BonusReward: { type: Number },
    RedemptionStatus: { type: Boolean },
    transactionDetails: [transactionDetailsSchema]
});
const cardDetailsSchema: Schema = new Schema<ICardDetails>({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Email: { type: String, required: true, unique: true },
    cardDetails: [cardSchema]  
});
export const CardDetails = mongoose.model<ICardDetails>('CardDetails', cardDetailsSchema);