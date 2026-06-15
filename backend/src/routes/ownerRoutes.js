import express from 'express';
import {
  createOwnerRoom,
  createOwnerHotel,
  deleteOwnerRoom,
  getOwnerDashboard,
  getOwnerHotels,
  getOwnerOrders,
  getOwnerRooms,
  updateOwnerHotel,
  updateOwnerOrderStatus,
  updateOwnerRoom,
} from '../controllers/ownerController.js';

const router = express.Router();

router.get('/:ownerId/dashboard', getOwnerDashboard);
router.get('/:ownerId/hotels', getOwnerHotels);
router.post('/:ownerId/hotels', createOwnerHotel);
router.put('/:ownerId/hotels/:hotelId', updateOwnerHotel);
router.get('/:ownerId/hotels/:hotelId/rooms', getOwnerRooms);
router.post('/:ownerId/hotels/:hotelId/rooms', createOwnerRoom);
router.put('/:ownerId/hotels/:hotelId/rooms/:roomId', updateOwnerRoom);
router.delete('/:ownerId/hotels/:hotelId/rooms/:roomId', deleteOwnerRoom);
router.get('/:ownerId/orders', getOwnerOrders);
router.put('/orders/:bookingId/status', updateOwnerOrderStatus);

export default router;
