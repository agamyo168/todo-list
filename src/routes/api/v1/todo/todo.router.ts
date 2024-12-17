import express, { RequestHandler } from 'express';
import {
  createTodo,
  deleteTodoById,
  getTodo,
  getTodoById,
  updateTodoById,
} from '../../../../controller/todo/todo.controller';
import {
  createTodoSchema,
  patchTodoSchema,
  validateBodyMiddleware,
  validateQueryMiddleware,
} from '../../../../middlewares/validation';
import { getTodoSchema } from '../../../../middlewares/validation/schema/todo.schema';

const todoRouter = express.Router();

todoRouter
  .route('/')
  .get(validateQueryMiddleware(getTodoSchema) as RequestHandler, getTodo)
  .post(validateBodyMiddleware(createTodoSchema) as RequestHandler, createTodo);
todoRouter
  .route('/:todoId')
  .get(getTodoById)
  .patch(
    validateBodyMiddleware(patchTodoSchema) as RequestHandler,
    updateTodoById
  )
  .delete(deleteTodoById);

export default todoRouter;
