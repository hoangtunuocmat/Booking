import express from 'express';
import {
  createAdminHotel,
  createAdminPromo,
  getAdminDashboard,
  getAdminHotels,
  getAdminOwners,
  getAdminPromos,
  getAdminUsers,
  updateAdminHotelStatus,
  updateAdminUserStatus,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', getAdminDashboard);
router.get('/hotels', getAdminHotels);
router.post('/hotels', createAdminHotel);
router.put('/hotels/:hotelId/status', updateAdminHotelStatus);
router.get('/owners', getAdminOwners);
router.get('/users', getAdminUsers);
router.put('/users/:username/status', updateAdminUserStatus);
router.get('/promos', getAdminPromos);
router.post('/promos', createAdminPromo);

export default router;
