import React, { useEffect, useMemo, useState } from 'react';
import { ownerApi } from '../../../api/ownerApi';
import { useAuth } from '../../../context/AuthContext';

const emptyRoomForm = {
  idloaiphong: 'LP01',
  tenphong: '',
  giatieuchuan: 0,
  phuthunguoilon: 0,
  phuthutreem: 0,
  succhuatieuchuan: 2,
  succhuatoida: 2,
  trangthai: 'Sẵn sàng',
  imageUrl: '',
};

const roomTypes = [
  { value: 'LP01', label: 'Standard' },
  { value: 'LP02', label: 'Deluxe' },
  { value: 'LP03', label: 'Suite' },
];

const ManageHotels = () => {
  const { user, profile } = useAuth();
  const ownerId = profile?.idchusohuu || profile?.username || user?.id || user?.username;
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(emptyRoomForm);
  const [editingRoomId, setEditingRoomId] = useState('');
  const [message, setMessage] = useState('');

  const selectedHotel = useMemo(
    () => hotels.find(hotel => hotel.idcoso === selectedHotelId),
    [hotels, selectedHotelId]
  );

  const loadHotels = () => {
    if (!ownerId) return;
    ownerApi.getHotels(ownerId)
      .then(res => {
        const nextHotels = res.data?.data || [];
        setHotels(nextHotels);
        setSelectedHotelId(current => current || nextHotels[0]?.idcoso || '');
      })
      .catch(err => setMessage(err.response?.data?.message || 'Không tải được danh sách cơ sở.'));
  };

  const loadRooms = () => {
    if (!ownerId || !selectedHotelId) return;
    ownerApi.getRooms(ownerId, selectedHotelId)
      .then(res => setRooms(res.data?.data || []))
      .catch(err => setMessage(err.response?.data?.message || 'Không tải được danh sách phòng.'));
  };

  useEffect(loadHotels, [ownerId]);
  useEffect(loadRooms, [ownerId, selectedHotelId]);

  const resetForm = () => {
    setForm(emptyRoomForm);
    setEditingRoomId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHotelId) return alert('Vui lòng chọn cơ sở cần quản lý phòng.');
    if (!form.tenphong || Number(form.giatieuchuan) <= 0) return alert('Vui lòng nhập tên phòng và giá hợp lệ.');

    try {
      if (editingRoomId) {
        await ownerApi.updateRoom(ownerId, selectedHotelId, editingRoomId, form);
        setMessage(`Đã cập nhật phòng ${editingRoomId} và lưu về Supabase.`);
      } else {
        const res = await ownerApi.createRoom(ownerId, selectedHotelId, form);
        setMessage(`Đã thêm phòng ${res.data?.data?.idphong || ''} cho cơ sở ${selectedHotelId} và lưu về Supabase.`);
      }
      resetForm();
      loadRooms();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Không thể lưu thông tin phòng.');
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.idphong);
    setForm({
      idloaiphong: room.idloaiphong || 'LP01',
      tenphong: room.tenphong || '',
      giatieuchuan: room.giatieuchuan || 0,
      phuthunguoilon: room.phuthunguoilon || 0,
      phuthutreem: room.phuthutreem || 0,
      succhuatieuchuan: room.succhuatieuchuan || 2,
      succhuatoida: room.succhuatoida || 2,
      trangthai: room.trangthai || 'Sẵn sàng',
      imageUrl: room.imageUrl || room.images?.[0]?.duongdananh || '',
    });
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm(`Xóa phòng ${roomId}?`)) return;
    try {
      await ownerApi.deleteRoom(ownerId, selectedHotelId, roomId);
      setMessage(`Đã xóa phòng ${roomId} khỏi Supabase.`);
      if (editingRoomId === roomId) resetForm();
      loadRooms();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Không thể xóa phòng.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>Quản lý phòng theo cơ sở</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Chọn cơ sở đang quản lý, sau đó thêm/sửa/xóa tên phòng, giá, phụ thu, sức chứa, trạng thái và ảnh phòng.</p>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '20px', display: 'grid', gridTemplateColumns: 'minmax(260px, 420px) 1fr', gap: '14px', alignItems: 'center' }}>
        <select value={selectedHotelId} onChange={e => setSelectedHotelId(e.target.value)} style={selectStyle}>
          <option value="" style={optionStyle}>Chọn cơ sở</option>
          {hotels.map(hotel => (
            <option key={hotel.idcoso} value={hotel.idcoso} style={optionStyle}>{hotel.idcoso} - {hotel.tencoso}</option>
          ))}
        </select>
        <div style={{ color: 'var(--text-secondary)' }}>
          {selectedHotel ? `${selectedHotel.diachi} · Trạng thái: ${selectedHotel.trangthai}` : 'Chưa chọn cơ sở'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ borderRadius: '18px', padding: '24px', display: 'grid', gridTemplateColumns: '1.2fr 180px 180px 180px', gap: '12px' }}>
        <input placeholder="Tên phòng" value={form.tenphong} onChange={e => setForm({ ...form, tenphong: e.target.value })} style={inputStyle} />
        <select value={form.idloaiphong} onChange={e => setForm({ ...form, idloaiphong: e.target.value })} style={selectStyle}>
          {roomTypes.map(type => <option key={type.value} value={type.value} style={optionStyle}>{type.label}</option>)}
        </select>
        <input type="number" min="0" placeholder="Giá tiêu chuẩn" value={form.giatieuchuan} onChange={e => setForm({ ...form, giatieuchuan: e.target.value })} style={inputStyle} />
        <select value={form.trangthai} onChange={e => setForm({ ...form, trangthai: e.target.value })} style={selectStyle}>
          <option value="Sẵn sàng" style={optionStyle}>Sẵn sàng</option>
          <option value="Đang bảo trì" style={optionStyle}>Đang bảo trì</option>
          <option value="Tạm khóa" style={optionStyle}>Tạm khóa</option>
        </select>
        <input type="number" min="0" placeholder="Phụ thu người lớn" value={form.phuthunguoilon} onChange={e => setForm({ ...form, phuthunguoilon: e.target.value })} style={inputStyle} />
        <input type="number" min="0" placeholder="Phụ thu trẻ em" value={form.phuthutreem} onChange={e => setForm({ ...form, phuthutreem: e.target.value })} style={inputStyle} />
        <input type="number" min="1" placeholder="Sức chứa chuẩn" value={form.succhuatieuchuan} onChange={e => setForm({ ...form, succhuatieuchuan: e.target.value })} style={inputStyle} />
        <input type="number" min="1" placeholder="Sức chứa tối đa" value={form.succhuatoida} onChange={e => setForm({ ...form, succhuatoida: e.target.value })} style={inputStyle} />
        <input placeholder="URL hình ảnh phòng" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / 4' }} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={primaryButtonStyle}>{editingRoomId ? 'Lưu sửa' : 'Thêm phòng'}</button>
          {editingRoomId && <button type="button" onClick={resetForm} style={secondaryButtonStyle}>Hủy</button>}
        </div>
      </form>

      {message && <div className="glass-panel" style={{ borderRadius: '14px', padding: '16px 18px', color: 'var(--accent)', fontWeight: 800 }}>{message}</div>}

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Danh sách phòng của {selectedHotel?.tencoso || 'cơ sở đã chọn'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {rooms.map(room => (
            <div key={room.idphong} style={roomCardStyle}>
              <div style={{ height: '130px', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', marginBottom: '12px' }}>
                {room.imageUrl ? <img src={room.imageUrl} alt={room.tenphong} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color: 'var(--text-secondary)', padding: '48px 16px', textAlign: 'center' }}>Chưa có ảnh</div>}
              </div>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{room.idphong} · {room.tenphong}</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.7 }}>
                Loại: {room.idloaiphong}<br />
                Giá: {Number(room.giatieuchuan || 0).toLocaleString('vi-VN')}đ<br />
                Phụ thu NL/TE: {Number(room.phuthunguoilon || 0).toLocaleString('vi-VN')}đ / {Number(room.phuthutreem || 0).toLocaleString('vi-VN')}đ<br />
                Sức chứa: {room.succhuatieuchuan} - {room.succhuatoida} khách<br />
                Trạng thái: {room.trangthai}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button onClick={() => handleEdit(room)} style={secondaryButtonStyle}>Sửa</button>
                <button onClick={() => handleDelete(room.idphong)} style={dangerButtonStyle}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
        {rooms.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Cơ sở này chưa có phòng.</div>}
      </div>
    </div>
  );
};

const inputStyle = { background: '#101820', color: 'var(--text-primary)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', padding: '12px', outline: 'none' };
const selectStyle = { ...inputStyle, colorScheme: 'dark' };
const optionStyle = { background: '#101820', color: '#f8fafc' };
const primaryButtonStyle = { background: 'var(--accent-gradient)', border: 'none', borderRadius: '10px', color: '#070708', fontWeight: 900, cursor: 'pointer', padding: '10px 14px' };
const secondaryButtonStyle = { background: 'rgba(192,132,252,0.14)', border: '1px solid rgba(192,132,252,0.45)', borderRadius: '10px', color: '#c084fc', fontWeight: 800, cursor: 'pointer', padding: '10px 14px' };
const dangerButtonStyle = { background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.45)', borderRadius: '10px', color: '#fca5a5', fontWeight: 800, cursor: 'pointer', padding: '10px 14px' };
const roomCardStyle = { background: 'rgba(9,15,22,0.72)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '18px', padding: '14px' };

export default ManageHotels;
