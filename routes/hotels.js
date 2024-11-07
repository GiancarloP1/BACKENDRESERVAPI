import express from 'express';
import { getHotels } from '../controllers/hotelController.js';

const router = express.Router();

// Ruta para obtener todos los hoteles
router.get('/', getHotels);

export default router;
