import mongoose, { Schema, Document, Types } from 'mongoose';

interface ITransactionDetails {
    Date: Date;
    Amount: number;
}

interface ICard {
    CardName: string;
    CardNumber: string;
    CardType: string;
    ExpiryDate: Date;
    BonusReward: number;
    RedemptionStatus: boolean;
    transactionDetails: ITransactionDetails[];
}

export interface ICardDetails extends Document {
    User: Types.ObjectId;  // Updated ObjectId type reference
    Email: string;
    cardDetails: ICard[];
}

const TransactionDetailsSchema = new Schema<ITransactionDetails>({
    Date: { type: Date, required: true },
    Amount: { type: Number, required: true }
});

const CardSchema = new Schema<ICard>({
    CardName: { type: String, required: true },
    CardNumber: { type: String, required: true },
    CardType: { type: String, required: true },
    ExpiryDate: { type: Date, required: true },
    BonusReward: { type: Number, required: true },
    RedemptionStatus: { type: Boolean, required: true },  // Fixed typo
    transactionDetails: [TransactionDetailsSchema]
});

const CardDetailsSchema: Schema = new Schema<ICardDetails>({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Email: { type: String, required: true, unique: true },
    cardDetails: [CardSchema]  
});

export const CardDetails = mongoose.model<ICardDetails>('CardDetails', CardDetailsSchema);
