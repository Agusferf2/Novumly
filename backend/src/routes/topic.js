import { Router }                        from 'express';
import { getToday, getByDate, markRead } from '../controllers/topicController.js';
import { authMiddleware }                from '../middleware/auth.js';

const router = Router();

router.get('/today',       authMiddleware, getToday);
router.get('/:date',       authMiddleware, getByDate);
router.post('/:date/read', authMiddleware, markRead);

export default router;
