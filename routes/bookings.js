import express from 'express';
import { payBooking, cancelBooking, createBooking, getBookings, deleteBooking } from '../controllers/bookingController.js';
import authenticateToken from '../middleware/auth.js'; 


const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/', authenticateToken, getBookings);
router.delete('/:id', authenticateToken, deleteBooking);
router.put('/:id/pay', authenticateToken, payBooking); 
router.delete('/:id/cancel', authenticateToken, cancelBooking); 

export default router;
