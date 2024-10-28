import Joi from 'joi';

export class UserValidation {
    static async createUser(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            FirstName: Joi.string().required(),
            LastName: Joi.string().required(),
            PhoneNumber: Joi.string().required(),
            Email: Joi.string().email().required(),
            Password: Joi.string().min(6).max(12).required(),
            Address: Joi.string().required(),
            DateOfBirth: Joi.date().required(),
            SSN: Joi.number().required(),
            AnnualIncome: Joi.number().required(),
            SecurQue1: Joi.string().required(),
            SecurAns1: Joi.string().required(),
            SecurQue2: Joi.string().required(),
            SecurAns2: Joi.string().required()
        })
        
        const isValid = await UserValidation.validate(req.body, res, schema);
        
        if (isValid) {
            next();
        }
    }

    static async login(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            Password: Joi.string().min(6).max(12).required(),
        })
        
        const isValid = await UserValidation.validate(req.body, res, schema);
        
        if (isValid) {
            next();
        }
    }


    static async forgetPassword(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            SecurQue: Joi.string().required(),
            SecurAns: Joi.string().required()
        })
        
        const isValid = await UserValidation.validate(req.body, res, schema);
        
        if (isValid) {
            next();
        }
    }


    static async resetPassword(req: any, res: any, next: any) {
        const schema = Joi.object().keys({
            Email: Joi.string().email().required(),
            Password: Joi.string().min(6).max(12).required()
        })
        
        const isValid = await UserValidation.validate(req.body, res, schema);
        
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