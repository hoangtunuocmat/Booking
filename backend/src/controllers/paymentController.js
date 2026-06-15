import { paymentModel } from '../models/paymentModel.js';

export const paymentController = {
  verifyPromo: async (req, res) => {
    try {
      const { code, basePrice } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: 'Thiếu mã khuyến mãi' });
      }

      // Check DB first
      const promo = await paymentModel.verifyPromo(code);
      if (promo) {
        return res.status(200).json({
          success: true,
          data: {
            code: promo.makuyenmai,
            discount: promo.giatri || 100000,
            description: promo.mota || 'Mã giảm giá được áp dụng.'
          }
        });
      }

      // Fallback/Mock rules for UX
      const upperCode = code.toUpperCase();
      if (upperCode === 'LUXURY500') {
        return res.status(200).json({
          success: true,
          data: { code: 'LUXURY500', discount: 500000, description: 'Giảm giá đặc quyền 500,000đ' }
        });
      } else if (upperCode === 'WELCOME10') {
        const discountAmount = Math.round((Number(basePrice) || 1000000) * 0.1);
        return res.status(200).json({
          success: true,
          data: { code: 'WELCOME10', discount: discountAmount, description: 'Giảm giá 10% đơn hàng chào mừng' }
        });
      }

      return res.status(404).json({ success: false, message: 'Mã khuyến mãi không hợp lệ hoặc đã hết hạn.' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi xử lý mã khuyến mãi.' });
    }
  },

  createPayment: async (req, res) => {
    try {
      const paymentData = req.body;
      const data = await paymentModel.create(paymentData);
      return res.status(201).json({ success: true, data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: err.message || 'Lỗi xử lý thanh toán.' });
    }
  }
};
