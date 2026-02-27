import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getHistory, sendMessage } from '../controllers/chatController.js';

const router = Router();

router.get('/:date',  authMiddleware, getHistory);
router.post('/:date', authMiddleware, sendMessage);

export default router;
