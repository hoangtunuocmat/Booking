import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/verify-promo', paymentController.verifyPromo);
router.post('/create', paymentController.createPayment);

export default router;
