import express, { RequestHandler } from 'express';

import authRoute from './auth/auth.router';
import todoRouter from './todo/todo.router';
import authHandlerMiddleware from '../../../middlewares/auth.handler.middleware';
import {
  userSchema,
  validateMiddleware,
} from '../../../middlewares/validation';

const router = express.Router();

router.use(
  '/auth',
  validateMiddleware(userSchema) as RequestHandler,
  authRoute
);
router.use(
  '/todos',
  authHandlerMiddleware,

  todoRouter
);
export default router;
