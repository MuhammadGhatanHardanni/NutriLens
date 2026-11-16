// src/routes/food.routes.js
import { Router } from 'express';
import { detectFood, searchFood } from '../controllers/food.controller.js';
import { optionalAuthenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Detect food from uploaded image (auth optional - bisa pakai tanpa login)
router.post('/detect', optionalAuthenticate, upload.single('image'), detectFood);

// Search food nutrition by name
router.get('/search', searchFood);

export default router;

