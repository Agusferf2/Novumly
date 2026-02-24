import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getMonth, getStreak, getRecent } from '../controllers/progressController.js';

const router = Router();

router.get('/month',  authMiddleware, getMonth);
router.get('/streak', authMiddleware, getStreak);
router.get('/recent', authMiddleware, getRecent);

export default router;
