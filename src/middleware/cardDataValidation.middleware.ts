import Joi from 'joi';
export class CardValidation {
    static async addCard(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            CardName: Joi.string().required(),
            CardHolderName: Joi.string().required(),
            CardNumber: Joi.string().min(10).max(12).required(),
            ExpiryDate: Joi.date().required(),
            SecurityCode: Joi.string().max(4).required()
        })
        const isValid = await CardValidation.validate(req.body, res, schema);

        if (isValid) {
            next();
        }
    }
    static async showCards(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required()
        })
        const isValid = await CardValidation.validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    }
    static async transaction(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            CardNumber: Joi.string().min(10).max(12).required(),
            MembershipID: Joi.string().required(),
            Amount: Joi.number().required(),

        })
        const isValid = await CardValidation.validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    }
    static async getTransactions(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            CardNumber: Joi.string().min(10).max(12).required()
        })
        const isValid = await CardValidation.validate(req.body, res, schema);
        if (isValid) {
            next();
        }
    }
    static async validate(body: any, res: any, schema: any) {
        try {
            const validation = await schema.validate(body, { abortEarly: false });
            if (validation.error) {
                const error = validation.error.details.map((e: any) => (e = e.message));
                res.status(422).json({
                    status: 422,
                    statusText: "VALIDATION_FAILED",
                    message: "Validation Failed!",
                    data: { error },
                });
                return false;
            }
            else {
                return true;
            }
        }
        catch (err) {
            console.log(err);
        }
    };
}
//     Date : Joi.string().required(),
//     Amount : Joi.string().required(),
//     MembershipID : Joi.string().required(),
//     CardName : Joi.string().required(),
//     CardHolderName : Joi.string().required(),
//     CardNumber : Joi.string().required(),
//     CardType : Joi.string().required(),
//     ExpiryDate : Joi.string().required(),
//     SecurityCode : Joi.string().required(),
//     BonusReward : Joi.string().required(),
//     RedemptionStatus : Joi.string().required(),
//     User : Joi.string().required(),
//     Email : Joi.string().required()