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
  validateMiddleware,
} from '../../../../middlewares/validation';

const todoRouter = express.Router();

todoRouter
  .route('/')
  .get(getTodo)
  .post(validateMiddleware(createTodoSchema) as RequestHandler, createTodo);
todoRouter
  .route('/:todoId')
  .get(getTodoById)
  .patch(validateMiddleware(patchTodoSchema) as RequestHandler, updateTodoById)
  .delete(deleteTodoById);

export default todoRouter;
