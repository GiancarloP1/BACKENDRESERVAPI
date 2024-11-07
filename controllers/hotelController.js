import Hotel from '../models/Hotel.js';

// Controlador para obtener todos los hoteles
export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los hoteles' });
    }
};
