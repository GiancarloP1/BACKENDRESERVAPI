import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

export const createBooking = async (req, res) => {
    const { hotelName, checkInDate, checkOutDate, roomType } = req.body;

    try {
        const hotel = await Hotel.findOne({ name: hotelName });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel no encontrado' });
        }

        if (hotel.availableRooms <= 0) {
            return res.status(400).json({ message: 'No hay habitaciones disponibles en este hotel' });
        }

        const newBooking = new Booking({
            user: req.user.id,
            hotelName,
            checkInDate,
            checkOutDate,
            roomType
        });

        await newBooking.save();

        hotel.availableRooms -= 1;
        await hotel.save();

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la reserva', error });
    }
};

export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las reservas', error });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verificar si el usuario es el dueño de la reserva
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        // Encontrar el hotel asociado y aumentar el número de habitaciones disponibles
        const hotel = await Hotel.findOne({ name: booking.hotelName });
        if (hotel) {
            hotel.availableRooms += 1;
            await hotel.save();
        }

        // Eliminar la reserva
        await Booking.deleteOne({ _id: req.params.id }); // Cambio de remove() a deleteOne()
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la reserva', error });
    }
};


