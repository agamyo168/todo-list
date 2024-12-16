import express from 'express';
import {
  createTodo,
  deleteTodoById,
  getTodo,
  getTodoById,
  updateTodoById,
} from '../../../../controller/todo/todo.controller';

const todoRouter = express.Router();

todoRouter.route('/').get(getTodo).post(createTodo);
todoRouter
  .route('/:todoId')
  .get(getTodoById)
  .put(updateTodoById)
  .delete(deleteTodoById);

export default todoRouter;
