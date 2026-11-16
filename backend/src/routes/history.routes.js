// src/routes/history.routes.js
import { Router } from 'express';
import { getHistory, getDailySummary, deleteHistory } from '../controllers/history.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Semua route history butuh login
router.use(authenticate);

router.get('/', getHistory);
router.get('/summary', getDailySummary);
router.delete('/:id', deleteHistory);

export default router;

