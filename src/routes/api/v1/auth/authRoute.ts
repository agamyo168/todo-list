import express from 'express';

const router = express.Router();

router.route('/login').post();
router.route('/signup').post();

export default router;
