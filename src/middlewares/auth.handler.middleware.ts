import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { UnauthorizedError } from './error';

const authHandlerMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHead = _req.headers.authorization;
  if (authHead == null || authHead.startsWith('Bearer') == false)
    return next(new UnauthorizedError(`invalid user token`));

  const token = authHead.split(' ')[1];
  try {
    const payload = jwt.verify(token, String(process.env.JWT_SECRET));
    res.locals.payload = payload;
    next();
  } catch (err) {
    logger.error(err);
    return next(new UnauthorizedError(`invalid user token`));
  }
};

export default authHandlerMiddleware;
