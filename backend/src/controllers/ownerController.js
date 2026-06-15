import { ownerModel } from '../models/ownerModel.js';

export const getOwnerDashboard = async (req, res) => {
  try {
    const data = await ownerModel.getDashboard(req.params.ownerId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOwnerHotels = async (req, res) => {
  try {
    const data = await ownerModel.getHotels(req.params.ownerId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createOwnerHotel = async (req, res) => {
  try {
    const data = await ownerModel.createHotel(req.params.ownerId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOwnerHotel = async (req, res) => {
  try {
    const data = await ownerModel.updateHotel(req.params.ownerId, req.params.hotelId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    const data = await ownerModel.getRooms(req.params.ownerId, req.params.hotelId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createOwnerRoom = async (req, res) => {
  try {
    const data = await ownerModel.createRoom(req.params.ownerId, req.params.hotelId, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOwnerRoom = async (req, res) => {
  try {
    const data = await ownerModel.updateRoom(req.params.ownerId, req.params.hotelId, req.params.roomId, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteOwnerRoom = async (req, res) => {
  try {
    const data = await ownerModel.deleteRoom(req.params.ownerId, req.params.hotelId, req.params.roomId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOwnerOrders = async (req, res) => {
  try {
    const data = await ownerModel.getOrders(req.params.ownerId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOwnerOrderStatus = async (req, res) => {
  try {
    const data = await ownerModel.updateOrderStatus(req.params.bookingId, req.body.trangthai);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
