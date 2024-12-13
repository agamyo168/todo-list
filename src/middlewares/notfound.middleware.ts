import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const notFoundMiddleware = (_req: Request, res: Response) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: 'false', msg: "This resource doesn't exist" });
};

export default notFoundMiddleware;
