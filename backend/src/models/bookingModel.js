import { supabase } from '../config/supabase.js';

const getNextId = async (table, column, prefix, padLength = 2) => {
  const { data, error } = await supabase.from(table).select(column);
  if (error) throw error;

  const maxNumber = (data || []).reduce((max, row) => {
    const value = row[column];
    if (typeof value !== 'string' || !value.startsWith(prefix)) return max;
    const numericPart = Number.parseInt(value.slice(prefix.length), 10);
    return Number.isNaN(numericPart) ? max : Math.max(max, numericPart);
  }, 0);

  return `${prefix}${String(maxNumber + 1).padStart(padLength, '0')}`;
};

const getNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) && diff > 0 ? diff : 1;
};

const findOrCreateCustomer = async ({ fullName, email, phone, username }) => {
  if (username) {
    const { data: existingCustomer, error: findError } = await supabase
      .from('khachhang')
      .select('*')
      .eq('username', username)
      .maybeSingle();

    if (findError) throw findError;
    if (existingCustomer) return existingCustomer;
  }

  if (email) {
    const { data: existingCustomer, error: findError } = await supabase
      .from('khachhang')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (findError) throw findError;
    if (existingCustomer) return existingCustomer;
  }

  const idkhachhang = await getNextId('khachhang', 'idkhachhang', 'KH', 2);
  const timestamp = Date.now();
  const guestUsername = `guest_${timestamp}`;

  const { error: accountError } = await supabase
    .from('taikhoan')
    .insert([{
      username: guestUsername,
      matkhau: '',
      vaitro: 'KhachHang',
      trangthai: 'Hoạt động',
    }]);

  if (accountError) throw accountError;

  const { data, error } = await supabase
    .from('khachhang')
    .insert([{
      idkhachhang,
      username: guestUsername,
      hoten: fullName,
      gioitinh: 'Khác',
      cccd: `9${String(timestamp).slice(-8)}`,
      sdt: phone,
      email,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

const resolveRoom = async ({ idphong, idcoso }) => {
  let query = supabase.from('phong').select('*');

  if (idphong) {
    const { data, error } = await query.eq('idphong', idphong).maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  if (idcoso) {
    const { data, error } = await supabase
      .from('phong')
      .select('*')
      .eq('idcoso', idcoso)
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  return null;
};

export const bookingModel = {
  create: async (bookingData) => {
    const { data, error } = await supabase
      .from('datphong')
      .insert([bookingData])
      .select();
    if (error) throw error;
    return data[0];
  },
  createWithPayment: async (payload) => {
    const customer = await findOrCreateCustomer(payload.customer || payload);
    const room = await resolveRoom(payload.room || {});

    const pricing = payload.pricing || {};
    const checkIn = payload.checkIn || new Date().toISOString().split('T')[0];
    const checkOut = payload.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const nights = getNights(checkIn, checkOut);
    const roomBasePrice = Number(pricing.basePrice || room?.giatieuchuan || 0);
    const serviceFee = Number(pricing.serviceFee || 0);
    const vatTax = Number(pricing.vatTax || 0);
    const discount = Number(pricing.discount || 0);
    const originalTotal = Number(pricing.originalTotal || roomBasePrice + serviceFee + vatTax);
    const finalPrice = Number(pricing.finalPrice || Math.max(originalTotal - discount, 0));

    const iddatphong = await getNextId('datphong', 'iddatphong', 'DP', 2);
    const idchitiet = await getNextId('chitietdatphong', 'idchitiet', 'CT', 2);
    const idthanhtoan = await getNextId('thanhtoan', 'idthanhtoan', 'TT', 2);

    const bookingInsert = {
      iddatphong,
      idkhachhang: customer.idkhachhang,
      ngaydat: new Date().toISOString(),
      ngaynhanphong: checkIn,
      ngaytraphong: checkOut,
      songuoilon: Number(payload.adults || 2),
      sotreem: Number(payload.children || 0),
      trangthai: 'Đã xác nhận',
      lydohuy: null,
    };

    const { data: booking, error: bookingError } = await supabase
      .from('datphong')
      .insert([bookingInsert])
      .select()
      .single();
    if (bookingError) throw bookingError;

    const detailInsert = {
      idchitiet,
      iddatphong,
      idphong: room?.idphong || null,
      soluong: 1,
      dongiaphong: roomBasePrice,
      tienphuthu: serviceFee + vatTax,
      thanhtien: originalTotal || roomBasePrice * nights,
    };

    let detail = null;
    if (room?.idphong) {
      const { data: detailData, error: detailError } = await supabase
        .from('chitietdatphong')
        .insert([detailInsert])
        .select()
        .single();
      if (detailError) throw detailError;
      detail = detailData;
    }

    const paymentInsert = {
      idthanhtoan,
      iddatphong,
      idma: payload.promo?.idma || null,
      tongtiengoc: originalTotal,
      sotiengiam: discount,
      tongtienthanhtoan: finalPrice,
      phuongthuc: payload.paymentMethod || 'Thẻ tín dụng',
      ngaythanhtoan: new Date().toISOString(),
      trangthai: 'Thành công',
    };

    const { data: payment, error: paymentError } = await supabase
      .from('thanhtoan')
      .insert([paymentInsert])
      .select()
      .single();
    if (paymentError) throw paymentError;

    return {
      booking,
      detail,
      payment,
      customer,
      room,
      nights,
    };
  },
  getAll: async () => {
    const { data, error } = await supabase.from('datphong').select('*');
    if (error) throw error;
    return data;
  },
  getById: async (id) => {
    const { data, error } = await supabase.from('datphong').select('*').eq('iddatphong', id).single();
    if (error) throw error;
    return data;
  }
};
