import express from 'express';
import { getTask } from '../../../../controller/todo/todo.controller';

const todoRouter = express.Router();

todoRouter.route('/').get(getTask);

export default todoRouter;
