import { hotelModel } from '../models/hotelModel.js';
export const getHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.getAll();
    res.json({ success: true, data: hotels });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await hotelModel.getById(id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};