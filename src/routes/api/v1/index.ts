import express from 'express';

import authRoute from './auth/authRoute';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/todos', _);
export default router;
