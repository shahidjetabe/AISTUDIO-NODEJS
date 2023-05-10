import Joi from 'joi';

export const JNumber = Joi.number();
export const JString = Joi.string().trim();
export const JEmail = JString.email().lowercase().trim();
export const JName = JString.min(3).max(25);
export const JPassword = JString.min(8).max(25);
export const JPhone = JString.regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/)
