import express from 'express';

import authRoute from './auth/auth.router';
import todoRouter from './todo/todo.router';
import authHandlerMiddleware from '../../../middlewares/auth.handler.middleware';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/todos', authHandlerMiddleware, todoRouter);
export default router;
