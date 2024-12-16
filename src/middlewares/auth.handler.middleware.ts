import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
const authHandlerMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHead = _req.headers.authorization;
  if (authHead == null || authHead.startsWith('Bearer') == false)
    return next(
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, msg: 'Invalid user token' })
    );
  const token = authHead.split(' ')[1];
  try {
    const payload = jwt.verify(token, String(process.env.JWT_SECRET));
    res.locals.payload = payload;
    next();
  } catch (err) {
    logger.error(err);
    return next(
      res.status(StatusCodes.OK).json({ success: false, msg: `${err}` })
    );
  }
};

export default authHandlerMiddleware;
