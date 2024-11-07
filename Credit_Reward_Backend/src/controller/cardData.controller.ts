import { Request, Response } from "express";
import { User } from "../modals/registration.modals";
import { CardDetails } from "../modals/cardDetails.modals";


export const addCard = async (req: Request, res: Response): Promise<any> => {
    const { Email, CardName, CardHolderName, CardNumber, ExpiryDate, SecurityCode } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        let userCardDetails = await CardDetails.findOne({ User: user._id });
        const existingCard = userCardDetails?.cardDetails.find((card) => card.CardNumber === CardNumber);
        if (existingCard) {
            return res.status(400).json({ message: "Card already exists" });
        }
        const newCard = {
            CardName,
            CardHolderName,
            CardNumber,
            ExpiryDate,
            SecurityCode,
            CardType: 'Visa', // Default value
            BonusReward: 0,     // Default value
            RedemptionStatus: true, // Default value
            transactionDetails: [] // Default empty array
        };
        if (userCardDetails) {
            userCardDetails.cardDetails.push(newCard);
            await userCardDetails.save();
        } else {
            userCardDetails = new CardDetails({
                User: user._id,
                Email: user.Email,
                cardDetails: [newCard]
            });
            await userCardDetails.save();
        }
        return res.status(201).json({ message: 'Card details saved successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const showCards = async (req: Request, res: Response): Promise<any> => {
    const { Email} = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        const userCard = await CardDetails.findOne({ User: user._id });
        if (!userCard) {
            console.log("No Cards To Show");
            return res.status(400).json({ message: "No cards to show" });
        }
        return res.status(200).json(userCard.cardDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const transaction = async (req: Request, res: Response): Promise<any> => {
    const { Email, CardNumber, MembershipID, Amount } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        // Check if the user has card details
        const userCard = await CardDetails.findOne({ User: user._id });
        if (!userCard) {
            return res.status(400).json({ message: "No cards to show" });
        }

        // Check if the card number exists within the user's cards
        const card = userCard.cardDetails.find(card => card.CardNumber === CardNumber);
        if (!card) {
            return res.status(400).json({ message: "Card not found" });
        }

        // Create a new transaction object
        const newTransaction = {
            MembershipID,
            Amount,
            Date: new Date()
        };

        // Add the transaction to the card's transactionDetails array
        card.transactionDetails.push(newTransaction);

        // Save the updated CardDetails document
        await userCard.save();

        return res.status(200).json({ message: 'Transaction updated successfully', transaction: newTransaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getTransactions = async (req: Request, res: Response): Promise<any> => {
    const { Email, CardNumber } = req.body; // CardNumbers should be an array of card numbers

    try {
        // Check if the user exists
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }

        // Find the user's card details
        const userCard = await CardDetails.findOne({ User: user._id });
        if (!userCard || userCard.cardDetails.length === 0) {
            return res.status(400).json({ message: "No cards to show" });
        }

        // Filter cards based on the provided CardNumbers
        const selectedCards = userCard.cardDetails.filter(card => CardNumber.includes(card.CardNumber));

        // Map the selected cards to extract only transaction details
        const transactions = selectedCards.map(card => ({
            CardNumber: card.CardNumber,
            transactions: card.transactionDetails
        }));

        return res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

/**
 * 
 
{
"Email":"test2@gmail.com"
"CardName": "Chase Freedom Unlimited", 
"CardHolderName": "Shikhar srivastava", 
"CardNumber": "458697854789", 
"ExpiryDate": "12-12-2025", 
"SecurityCode": "589"
}
 */