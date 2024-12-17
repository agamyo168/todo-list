import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Schema } from 'joi';

const validateMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.details[0].message });
    }
    next();
  };
};

export { validateMiddleware };
