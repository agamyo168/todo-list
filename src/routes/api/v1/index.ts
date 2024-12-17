import express, { RequestHandler } from 'express';

import authRoute from './auth/auth.router';
import todoRouter from './todo/todo.router';
import authHandlerMiddleware from '../../../middlewares/auth.handler.middleware';
import {
  userSchema,
  validateBodyMiddleware,
} from '../../../middlewares/validation';

const router = express.Router();

router.use(
  '/auth',
  validateBodyMiddleware(userSchema) as RequestHandler,
  authRoute
);
router.use(
  '/todos',
  authHandlerMiddleware,

  todoRouter
);
export default router;
