import {
  //  NextFunction,
  Request,
  Response,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import Todo from '../../models/todos.model';
import logger from '../../utils/logger';

const createTodo = async (req: Request, res: Response) => {
  const { title, desc, check } = req.body;
  const { id: userId } = res.locals.payload;
  console.log(title, desc, check);
  //Validation Here -> Check title should be a string and is required, check has to be boolean default is false, and desc is string default ''
  try {
    const todo = await Todo.create({
      userId,
      title,
      desc,
      check,
    });
    res.status(StatusCodes.CREATED).json({ success: true, todo });
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.BAD_REQUEST).json({ success: false });
  }
};

const getTodo = async (
  req: Request,
  res: Response
  //  next: NextFunction
) => {
  const { id: userId } = res.locals.payload;
  const todo = await Todo.findAll({ where: { userId: userId } });
  res.status(StatusCodes.OK).json({ success: true, todo });
};

const getTodoById = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, msg: 'Task retrieved' });
};
const updateTodoById = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, msg: 'Task retrieved' });
};
const deleteTodoById = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ success: true, msg: 'Task retrieved' });
};
export { getTodo, createTodo, getTodoById, updateTodoById, deleteTodoById };
