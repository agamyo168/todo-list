import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Todos from '../../models/todos.model';
import logger from '../../utils/logger';

const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { title, desc, check } = req.body;
  const { id: userId } = res.locals.payload;
  //Validation Here -> Check title should be a string and is required, check has to be boolean default is false, and desc is string default ''
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
    next(res.status(StatusCodes.BAD_REQUEST).json({ success: false }));
  }
};

const getTodo = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = res.locals.payload;
  try {
    const todo = await Todos.findAll({ where: { userId: userId } });
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (err) {
    logger.error(err);
    next(res.status(StatusCodes.BAD_REQUEST).json({ success: false }));
  }
};

const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = res.locals.payload;
  const { todoId } = req.params;
  try {
    const todo = await Todos.findOne({ where: { userId: userId, id: todoId } });
    if (todo == null)
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, msg: 'No such todo' })
      );
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (error) {
    logger.error(error);
    next(res.status(StatusCodes.BAD_REQUEST).json({ success: false }));
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
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, msg: "There's no such todo" })
      );
    }
    res.status(StatusCodes.OK).json({ success: true, todo: todo[1][0] });
  } catch (error) {
    logger.error(error);
    next(res.status(StatusCodes.BAD_REQUEST).json({ success: false }));
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
    if (todo == 0)
      return next(
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, msg: 'No such todo' })
      );
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (error) {
    logger.error(error);
    next(res.status(StatusCodes.BAD_REQUEST).json({ success: false }));
  }
};
export { getTodo, createTodo, getTodoById, updateTodoById, deleteTodoById };
