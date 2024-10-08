import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import HttpStatusCodes from "../constants/HttpStatusCodes";

const NewPasswordMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //Perform Joi Validation
    const noteSchema = Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
    }).options({ abortEarly: false });

    const { error } = noteSchema.validate(req.body, { abortEarly: false });

    //Check If Validation succeeded
    if (error) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: error.details.map(detail => detail.message) });
    }

    next();
};

//Export Default Constant
export { NewPasswordMiddleware };