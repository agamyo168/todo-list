import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Todos from '../../models/todos.model';
import logger from '../../utils/logger';
import NotFound from '../../middlewares/error/custom/notfound.error.class';

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { title, desc, check } = req.body;
  const { id: userId } = res.locals.payload;
  try {
    const todo = await Todos.create({
      userId,
      title,
      desc,
      check,
    });
    res.status(StatusCodes.CREATED).json({ success: true, todo });
  } catch (err) {
    logger.error(err);
    next(new Error(`${err}`));
  }
};

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = res.locals.payload;
  try {
    const todo = await Todos.findAll({ where: { userId: userId } });
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (err) {
    logger.error(err);
    next(new Error(`${err}`));
  }
};

const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = res.locals.payload;
  const { todoId } = req.params;
  try {
    const todo = await Todos.findOne({ where: { userId: userId, id: todoId } });
    if (todo == null) return next(new NotFound(`No such todo`));
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (error) {
    logger.error(error);
    next(new Error(`${error}`));
  }
};
const updateTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const todoBody = req.body;
  const { id: userId } = res.locals.payload;
  const { todoId } = req.params;
  try {
    const todo = await Todos.update(todoBody, {
      where: { userId: userId, id: todoId },
      returning: true,
    });
    if (todo[0] == 0) {
      // logger.error('No such todo');
      return next(new NotFound(`No such todo`));
    }
    res.status(StatusCodes.OK).json({ success: true, todo: todo[1][0] });
  } catch (error) {
    logger.error(error);
    next(new Error(`${error}`));
  }
};
const deleteTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = res.locals.payload;
  const { todoId } = req.params;
  try {
    const todo = await Todos.destroy({ where: { userId: userId, id: todoId } });
    if (todo == 0) return next(new NotFound(`No such todo`));
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (error) {
    logger.error(error);
    next(new Error(`${error}`));
  }
};
export { getTodo, createTodo, getTodoById, updateTodoById, deleteTodoById };
