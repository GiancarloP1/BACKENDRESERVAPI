import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotelName: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    roomType: { type: String, required: true }, // Ejemplo: "single", "double", etc.
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
