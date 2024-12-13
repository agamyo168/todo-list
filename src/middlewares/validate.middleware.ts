import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';

//func => func is called currying
const validate =
  (schema: Joi.ObjectSchema) => (req: Request, res: Response) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: 'Validation error',
        details: error.details,
      });
    }
  };
export default validate;
