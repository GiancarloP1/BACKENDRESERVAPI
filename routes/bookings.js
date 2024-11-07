import express from 'express';
import { createBooking, getBookings, deleteBooking } from '../controllers/bookingController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
