import Joi from "joi";

export const signupSchema = Joi.object({
    name: Joi.string().min(2).max(25).trim(false).required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(18).alphanum().required(),
});