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

export const adminModel = {
  getDashboard: async () => {
    const [{ data: hotels }, { data: accounts }, { data: bookings }, { data: payments }] = await Promise.all([
      supabase.from('cosoluutru').select('*'),
      supabase.from('taikhoan').select('*'),
      supabase.from('datphong').select('*'),
      supabase.from('thanhtoan').select('*'),
    ]);

    return {
      totalHotels: hotels?.length || 0,
      pendingHotels: hotels?.filter(hotel => hotel.trangthai === 'Chờ duyệt').length || 0,
      totalUsers: accounts?.length || 0,
      totalBookings: bookings?.length || 0,
      revenue: (payments || []).reduce((sum, item) => sum + Number(item.tongtienthanhtoan || 0), 0),
    };
  },

  getHotels: async () => {
    const [{ data: hotels, error }, { data: owners, error: ownerError }] = await Promise.all([
      supabase.from('cosoluutru').select('*').order('idcoso'),
      supabase.from('chusohuu').select('*'),
    ]);
    if (error) throw error;
    if (ownerError) throw ownerError;

    return (hotels || []).map(hotel => ({
      ...hotel,
      owner: (owners || []).find(owner => owner.idchusohuu === hotel.idchusohuu),
    }));
  },

  getOwners: async () => {
    const [{ data: owners, error }, { data: accounts, error: accountError }] = await Promise.all([
      supabase.from('chusohuu').select('*').order('idchusohuu'),
      supabase.from('taikhoan').select('*').eq('vaitro', 'ChuSoHuu'),
    ]);

    if (error) throw error;
    if (accountError) throw accountError;

    return (owners || []).map(owner => ({
      ...owner,
      account: (accounts || []).find(account => account.username === owner.username),
    }));
  },

  createHotel: async (hotelData) => {
    const ownerId = hotelData.idchusohuu;
    if (!ownerId) throw new Error('Vui lòng chọn chủ sở hữu cho cơ sở');

    const idcoso = await getNextId('cosoluutru', 'idcoso', 'CS', 2);
    const payload = {
      idcoso,
      idloai: hotelData.idloai || 'LC01',
      idkhuvuc: hotelData.idkhuvuc || 'KV01',
      idchusohuu: ownerId,
      tencoso: hotelData.tencoso,
      diachi: hotelData.diachi,
      sosao: Number(hotelData.sosao || 3),
      mota: hotelData.mota || '',
      trangthai: 'Chờ duyệt',
    };

    const { data, error } = await supabase.from('cosoluutru').insert([payload]).select().single();
    if (error) throw error;
    return data;
  },

  updateHotelStatus: async (idcoso, trangthai) => {
    const { data, error } = await supabase
      .from('cosoluutru')
      .update({ trangthai })
      .eq('idcoso', idcoso)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getUsers: async () => {
    const [{ data: accounts, error: accountError }, { data: customers }, { data: owners }, { data: employees }] = await Promise.all([
      supabase.from('taikhoan').select('*').order('username'),
      supabase.from('khachhang').select('*'),
      supabase.from('chusohuu').select('*'),
      supabase.from('nhanvien').select('*'),
    ]);
    if (accountError) throw accountError;

    return (accounts || []).map((account) => {
      const profile = [...(customers || []), ...(owners || []), ...(employees || [])].find(item => item.username === account.username);
      return { ...account, profile };
    });
  },

  updateUserStatus: async (username, trangthai) => {
    const { data, error } = await supabase
      .from('taikhoan')
      .update({ trangthai })
      .eq('username', username)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getPromos: async () => {
    const [{ data: promos, error: promoError }, { data: codes, error: codeError }] = await Promise.all([
      supabase.from('khuyenmai').select('*').order('idkhuyenmai'),
      supabase.from('magiamgia').select('*').order('idma'),
    ]);
    if (promoError) throw promoError;
    if (codeError) throw codeError;

    return (promos || []).map(promo => ({
      ...promo,
      codes: (codes || []).filter(code => code.idkhuyenmai === promo.idkhuyenmai),
    }));
  },

  createPromo: async (promoData) => {
    const idkhuyenmai = await getNextId('khuyenmai', 'idkhuyenmai', 'KM', 2);
    const idma = await getNextId('magiamgia', 'idma', 'MG', 2);

    const promoPayload = {
      idkhuyenmai,
      tenkhuyenmai: promoData.tenkhuyenmai,
      mota: promoData.mota || '',
      phantramgiam: Number(promoData.phantramgiam || 0),
      ngaybatdau: promoData.ngaybatdau,
      ngayketthuc: promoData.ngayketthuc,
    };

    const { data: promo, error: promoError } = await supabase.from('khuyenmai').insert([promoPayload]).select().single();
    if (promoError) throw promoError;

    const { data: code, error: codeError } = await supabase
      .from('magiamgia')
      .insert([{ idma, idkhuyenmai, macode: promoData.macode, soluong: Number(promoData.soluong || 1) }])
      .select()
      .single();
    if (codeError) throw codeError;

    return { ...promo, codes: [code] };
  },
};
