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
  //pagination:
  const { page = 1 } = req.query;
  const limit = 10;
  const offset = limit * (Number(page) - 1);
  const { id: userId } = res.locals.payload;
  try {
    const todo = await Todos.findAll({
      where: { userId: userId },
      limit: limit,
      offset: offset,
    });
    res.status(StatusCodes.OK).json({ success: true, todo });
  } catch (err) {
    logger.error(err);
    next(new Error(`${err}`));
  }
};
/**
 * @openapi
 * '/api/v1/todos/{todosId}':
 *   get:
 *     tags:
 *       - Todos
 *     summary: Get a single todos by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: todosId
 *         in: path
 *         description: the id of the todos
 *         required: true
 *     responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Todo'
 *        404:
 *          description: Todo not found
 *        401:
 *          description: Unauthorized User or invalid token
 *
 */

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
