import { Router }          from 'express';
import { generateForDate } from '../controllers/adminController.js';

const router = Router();

router.post('/generate/:date', generateForDate);

export default router;
