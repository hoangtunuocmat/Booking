import { bookingModel } from '../models/bookingModel.js';

export const createBooking = async (req, res) => {
  try {
    const newBooking = await bookingModel.createWithPayment(req.body);
    res.status(201).json({ success: true, data: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAll();
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
