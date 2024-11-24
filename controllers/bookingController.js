import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';

export const createBooking = async (req, res) => {
    const { hotelName, checkInDate, checkOutDate, roomType } = req.body;

    try {
        // Validar que las fechas sean válidas
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Eliminar horas, minutos, y segundos de la fecha actual

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // Eliminar horas de las fechas ingresadas
        checkIn.setHours(0, 0, 0, 0);
        checkOut.setHours(0, 0, 0, 0);

        if (checkIn < today) {
            return res.status(400).json({ message: 'La fecha de entrada no puede ser anterior a hoy.' });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({ message: 'La fecha de salida debe ser posterior a la fecha de entrada.' });
        }

        // Verificar si el hotel existe y tiene habitaciones disponibles
        const hotel = await Hotel.findOne({ name: hotelName });
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel no encontrado' });
        }

        if (hotel.availableRooms <= 0) {
            return res.status(400).json({ message: 'No hay habitaciones disponibles en este hotel' });
        }

        // Crear la reserva
        const newBooking = new Booking({
            user: req.user.id,
            hotelName,
            checkInDate,
            checkOutDate,
            roomType
        });

        await newBooking.save();

        // Reducir el número de habitaciones disponibles en el hotel
        hotel.availableRooms -= 1;
        await hotel.save();

        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
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
        await Booking.deleteOne({ _id: req.params.id }); 
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la reserva', error });
    }
};

// Marcar una reserva como pagada
export const payBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verificar que la reserva pertenece al usuario autenticado
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        // Marcar como pagada
        booking.paid = true;
        await booking.save();

        res.json({ message: 'Reserva pagada exitosamente', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al procesar el pago', error });
    }
};


// Cancelar una reserva
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        // Verificar que la reserva pertenece al usuario autenticado
        if (booking.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }

        // Si está pagada, procesar una lógica especial (opcional)
        if (booking.paid) {
            return res.status(400).json({ message: 'No se puede cancelar una reserva pagada' });
        }

        // Aumentar el número de habitaciones disponibles en el hotel
        const hotel = await Hotel.findOne({ name: booking.hotelName });
        if (hotel) {
            hotel.availableRooms += 1;
            await hotel.save();
        }

        // Eliminar la reserva
        await booking.deleteOne();
        res.json({ message: 'Reserva cancelada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cancelar la reserva', error });
    }
};



