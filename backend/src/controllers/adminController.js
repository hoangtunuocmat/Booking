import { adminModel } from '../models/adminModel.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const data = await adminModel.getDashboard();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminHotels = async (req, res) => {
  try {
    const data = await adminModel.getHotels();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminOwners = async (req, res) => {
  try {
    const data = await adminModel.getOwners();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdminHotel = async (req, res) => {
  try {
    const data = await adminModel.createHotel(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminHotelStatus = async (req, res) => {
  try {
    const data = await adminModel.updateHotelStatus(req.params.hotelId, req.body.trangthai);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const data = await adminModel.getUsers();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAdminUserStatus = async (req, res) => {
  try {
    const data = await adminModel.updateUserStatus(req.params.username, req.body.trangthai);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAdminPromos = async (req, res) => {
  try {
    const data = await adminModel.getPromos();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAdminPromo = async (req, res) => {
  try {
    const data = await adminModel.createPromo(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
