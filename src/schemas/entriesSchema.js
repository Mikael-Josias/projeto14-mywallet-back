import Joi from "joi";

export const entriesSchema = Joi.object({
    description: Joi.string().required(),
    price: Joi.number().required(),
    type: Joi.string().valid("incoming", "outgoing").required(),
});