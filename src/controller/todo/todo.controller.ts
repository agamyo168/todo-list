import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const getTask = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, msg: 'Task retrieved' });
};
export { getTask };
