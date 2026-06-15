import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import hotelRoutes from './src/routes/hotelRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import ownerRoutes from './src/routes/ownerRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware
app.use(cors());
app.use(express.json());

// Định tuyến API Endpoints
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Tuyến mặc định kiểm tra trạng thái server
app.get('/', (req, res) => {
  res.send('API Booking Server (Node.js & Express) is running...');
});

// Kích hoạt lắng nghe cổng kết nối
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
