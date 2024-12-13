import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Users from '../../models/users';
import logger from '../../utils/db/logger';

const login = (_req: Request, res: Response) => {
  console.log(_req.body);
  //JOI -> Will handle validation
  // Assume Valid User Input

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    msg: 'Login',
  });
};
const signup = async (_req: Request, res: Response) => {
  console.log(_req.body);
  // Assume Valid User Input
  //BCrypt
  //Insert it into DB
  try {
    console.log('CREATING USER IN DB....');
    const user = await Users.create({
      email: _req.body.email,
      password: _req.body.password,
    });
    console.log('USER CREATED');
    console.log(user);
    res.status(StatusCodes.ACCEPTED).json({
      success: true,
      msg: 'Sign up',
    });
  } catch (err) {
    logger.error(`${err}`);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, msg: 'Failed to create a user' });
  }
};

export { login, signup };
