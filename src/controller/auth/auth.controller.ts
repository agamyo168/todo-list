import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import Users, { User } from '../../models/users.model';

import logger from '../../utils/logger';

const login = async (_req: Request, res: Response, next: NextFunction) => {
  const { email, password } = _req.body;
  //JOI -> Will handle validation
  // Assume Valid User Input
  //Authentication -> checks if email exists
  const user = (await Users.findOne({ where: { email } })) as User | null;
  if (user == null) return next(res.status(StatusCodes.BAD_REQUEST)); //Email doesn't exist
  //Authentication -> checks if password is correct
  if ((await user.compare(password)) == false) return next(res.status(401)); //Password is incorrect
  //Valid login should return a token.
  const token = user.signToken();
  res.status(StatusCodes.OK).json({
    success: true,
    token,
    user,
  });
};
const signup = async (_req: Request, res: Response) => {
  const { email, password } = _req.body;
  // Assume Valid User Input
  //BCrypt
  //Insert it into DB
  try {
    const user = (await Users.create({
      email,
      password,
    })) as User;
    res.status(StatusCodes.CREATED).json({
      success: true,
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    logger.error(`${err}`);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, msg: 'Failed to create a user' });
  }
};

export { login, signup };
