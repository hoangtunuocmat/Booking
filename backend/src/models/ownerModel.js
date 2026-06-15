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

const getOwnerId = async (ownerIdOrUsername) => {
  if (!ownerIdOrUsername) throw new Error('Thiếu thông tin chủ sở hữu');
  if (ownerIdOrUsername.startsWith('CSH')) return ownerIdOrUsername;

  const { data, error } = await supabase
    .from('chusohuu')
    .select('idchusohuu')
    .eq('username', ownerIdOrUsername)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Không tìm thấy chủ sở hữu');
  return data.idchusohuu;
};

const getOwnerProfile = async (ownerId) => {
  const { data, error } = await supabase
    .from('chusohuu')
    .select('*')
    .eq('idchusohuu', ownerId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

const assertOwnerHotel = async (ownerIdOrUsername, idcoso) => {
  const ownerId = await getOwnerId(ownerIdOrUsername);
  const { data, error } = await supabase
    .from('cosoluutru')
    .select('idcoso,idchusohuu,tencoso')
    .eq('idcoso', idcoso)
    .eq('idchusohuu', ownerId)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Cơ sở không thuộc quyền quản lý của chủ sở hữu');
  return data;
};

const enrichRoomImages = async (rooms) => {
  const roomIds = (rooms || []).map(room => room.idphong);
  if (roomIds.length === 0) return [];

  const { data: images, error } = await supabase
    .from('hinhanhphong')
    .select('*')
    .in('idphong', roomIds);

  if (error) throw error;

  return rooms.map(room => ({
    ...room,
    images: (images || []).filter(image => image.idphong === room.idphong),
    imageUrl: (images || []).find(image => image.idphong === room.idphong)?.duongdananh || '',
  }));
};

const replaceRoomImage = async (idphong, imageUrl) => {
  await supabase.from('hinhanhphong').delete().eq('idphong', idphong);

  if (!imageUrl) return null;

  const { data, error } = await supabase
    .from('hinhanhphong')
    .insert([{ idphong, duongdananh: imageUrl }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

const enrichOrders = async (bookings) => {
  const { data: customers, error: customerError } = await supabase.from('khachhang').select('*');
  if (customerError) throw customerError;

  const { data: details, error: detailError } = await supabase.from('chitietdatphong').select('*');
  if (detailError) throw detailError;

  const { data: rooms, error: roomError } = await supabase.from('phong').select('*');
  if (roomError) throw roomError;

  const { data: hotels, error: hotelError } = await supabase.from('cosoluutru').select('*');
  if (hotelError) throw hotelError;

  const { data: payments, error: paymentError } = await supabase.from('thanhtoan').select('*');
  if (paymentError) throw paymentError;

  return bookings.map((booking) => {
    const detail = details.find(item => item.iddatphong === booking.iddatphong);
    const room = rooms.find(item => item.idphong === detail?.idphong);
    const hotel = hotels.find(item => item.idcoso === room?.idcoso);
    const customer = customers.find(item => item.idkhachhang === booking.idkhachhang);
    const payment = payments.find(item => item.iddatphong === booking.iddatphong);

    return { ...booking, detail, room, hotel, customer, payment };
  });
};

export const ownerModel = {
  getHotels: async (ownerIdOrUsername) => {
    const ownerId = await getOwnerId(ownerIdOrUsername);
    const { data, error } = await supabase
      .from('cosoluutru')
      .select('*')
      .eq('idchusohuu', ownerId)
      .order('idcoso');

    if (error) throw error;
    return data;
  },

  createHotel: async (ownerIdOrUsername, hotelData) => {
    const ownerId = await getOwnerId(ownerIdOrUsername);
    const ownerProfile = await getOwnerProfile(ownerId);
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

    const { data: message, error: messageError } = await supabase
      .from('tinnhan')
      .insert([{
        nguoigui: ownerProfile?.username || ownerIdOrUsername,
        nguoinhan: 'admin01',
        noidung: `Yêu cầu duyệt cơ sở mới ${idcoso} - ${hotelData.tencoso} từ chủ sở hữu ${ownerProfile?.hoten || ownerId}.`,
        ngaygui: new Date().toISOString(),
        dadoc: false,
      }])
      .select()
      .maybeSingle();

    if (messageError) throw messageError;

    return { ...data, adminMessage: message };
  },

  updateHotel: async (ownerIdOrUsername, idcoso, hotelData) => {
    const ownerId = await getOwnerId(ownerIdOrUsername);
    const payload = {
      tencoso: hotelData.tencoso,
      diachi: hotelData.diachi,
      sosao: Number(hotelData.sosao || 3),
      mota: hotelData.mota || '',
      trangthai: hotelData.trangthai || 'Chờ duyệt',
    };

    const { data, error } = await supabase
      .from('cosoluutru')
      .update(payload)
      .eq('idcoso', idcoso)
      .eq('idchusohuu', ownerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getRooms: async (ownerIdOrUsername, idcoso) => {
    await assertOwnerHotel(ownerIdOrUsername, idcoso);
    const { data, error } = await supabase
      .from('phong')
      .select('*')
      .eq('idcoso', idcoso)
      .order('idphong');

    if (error) throw error;
    return enrichRoomImages(data || []);
  },

  createRoom: async (ownerIdOrUsername, idcoso, roomData) => {
    await assertOwnerHotel(ownerIdOrUsername, idcoso);
    const idphong = await getNextId('phong', 'idphong', 'P', 2);
    const payload = {
      idphong,
      idcoso,
      idloaiphong: roomData.idloaiphong || 'LP01',
      tenphong: roomData.tenphong,
      giatieuchuan: Number(roomData.giatieuchuan || 0),
      phuthunguoilon: Number(roomData.phuthunguoilon || 0),
      phuthutreem: Number(roomData.phuthutreem || 0),
      succhuatieuchuan: Number(roomData.succhuatieuchuan || 2),
      succhuatoida: Number(roomData.succhuatoida || 2),
      trangthai: roomData.trangthai || 'Sẵn sàng',
    };

    const { data, error } = await supabase.from('phong').insert([payload]).select().single();
    if (error) throw error;

    const image = await replaceRoomImage(idphong, roomData.imageUrl);
    return { ...data, images: image ? [image] : [], imageUrl: image?.duongdananh || '' };
  },

  updateRoom: async (ownerIdOrUsername, idcoso, idphong, roomData) => {
    await assertOwnerHotel(ownerIdOrUsername, idcoso);
    const payload = {
      idloaiphong: roomData.idloaiphong || 'LP01',
      tenphong: roomData.tenphong,
      giatieuchuan: Number(roomData.giatieuchuan || 0),
      phuthunguoilon: Number(roomData.phuthunguoilon || 0),
      phuthutreem: Number(roomData.phuthutreem || 0),
      succhuatieuchuan: Number(roomData.succhuatieuchuan || 2),
      succhuatoida: Number(roomData.succhuatoida || 2),
      trangthai: roomData.trangthai || 'Sẵn sàng',
    };

    const { data, error } = await supabase
      .from('phong')
      .update(payload)
      .eq('idphong', idphong)
      .eq('idcoso', idcoso)
      .select()
      .single();

    if (error) throw error;

    const image = await replaceRoomImage(idphong, roomData.imageUrl);
    return { ...data, images: image ? [image] : [], imageUrl: image?.duongdananh || '' };
  },

  deleteRoom: async (ownerIdOrUsername, idcoso, idphong) => {
    await assertOwnerHotel(ownerIdOrUsername, idcoso);
    await supabase.from('hinhanhphong').delete().eq('idphong', idphong);

    const { data, error } = await supabase
      .from('phong')
      .delete()
      .eq('idphong', idphong)
      .eq('idcoso', idcoso)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getOrders: async (ownerIdOrUsername) => {
    const ownerId = await getOwnerId(ownerIdOrUsername);
    const hotels = await ownerModel.getHotels(ownerId);
    const hotelIds = hotels.map(hotel => hotel.idcoso);

    if (hotelIds.length === 0) return [];

    const { data: rooms, error: roomError } = await supabase
      .from('phong')
      .select('*')
      .in('idcoso', hotelIds);
    if (roomError) throw roomError;

    const roomIds = rooms.map(room => room.idphong);
    if (roomIds.length === 0) return [];

    const { data: details, error: detailError } = await supabase
      .from('chitietdatphong')
      .select('iddatphong')
      .in('idphong', roomIds);
    if (detailError) throw detailError;

    const bookingIds = [...new Set(details.map(detail => detail.iddatphong))];
    if (bookingIds.length === 0) return [];

    const { data: bookings, error: bookingError } = await supabase
      .from('datphong')
      .select('*')
      .in('iddatphong', bookingIds)
      .order('ngaydat', { ascending: false });
    if (bookingError) throw bookingError;

    return enrichOrders(bookings);
  },

  updateOrderStatus: async (iddatphong, trangthai) => {
    const { data, error } = await supabase
      .from('datphong')
      .update({ trangthai })
      .eq('iddatphong', iddatphong)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getDashboard: async (ownerIdOrUsername) => {
    const hotels = await ownerModel.getHotels(ownerIdOrUsername);
    const orders = await ownerModel.getOrders(ownerIdOrUsername);
    const revenue = orders.reduce((sum, order) => sum + Number(order.payment?.tongtienthanhtoan || 0), 0);
    const now = new Date();
    const monthlyOrders = orders.filter((order) => {
      const bookedAt = new Date(order.ngaydat);
      return bookedAt.getMonth() === now.getMonth() && bookedAt.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalHotels: hotels.length,
      monthlyOrders,
      totalOrders: orders.length,
      revenue,
      hotels,
      recentOrders: orders.slice(0, 5),
    };
  },
};
