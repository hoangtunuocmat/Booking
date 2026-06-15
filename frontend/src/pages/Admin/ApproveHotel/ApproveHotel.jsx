import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/adminApi';

const ApproveHotel = () => {
  const [hotels, setHotels] = useState([]);
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({ idchusohuu: '', tencoso: '', diachi: '', sosao: 3, mota: '' });
  const [statusFilter, setStatusFilter] = useState('Chờ duyệt');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');

  const loadHotels = () => adminApi.getHotels().then(res => setHotels(res.data?.data || []));
  const loadOwners = () => adminApi.getUsers().then(res => {
    const ownerUsers = (res.data?.data || []).filter(user => user.vaitro === 'ChuSoHuu');
    setOwners(ownerUsers);
  });

  useEffect(() => {
    loadHotels();
    loadOwners();
  }, []);

  const handleStatus = async (idcoso, trangthai) => {
    await adminApi.updateHotelStatus(idcoso, trangthai);
    loadHotels();
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    if (!form.idchusohuu || !form.tencoso || !form.diachi) {
      alert('Vui lòng chọn chủ sở hữu, nhập tên cơ sở và địa chỉ.');
      return;
    }

    await adminApi.createHotel(form);
    setForm({ idchusohuu: '', tencoso: '', diachi: '', sosao: 3, mota: '' });
    loadHotels();
  };

  const pendingHotels = hotels.filter(hotel => hotel.trangthai === 'Chờ duyệt');
  const otherHotels = hotels.filter(hotel => hotel.trangthai !== 'Chờ duyệt');
  const filteredHotels = hotels.filter(hotel => {
    const matchStatus = statusFilter === 'all' || hotel.trangthai === statusFilter;
    const matchOwner = !ownerFilter || hotel.idchusohuu === ownerFilter;
    const matchHotel = !hotelFilter || hotel.idcoso === hotelFilter;
    return matchStatus && matchOwner && matchHotel;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)' }}>Duyệt bài đăng cơ sở lưu trú</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Admin có thể tạo cơ sở cho tài khoản chủ sở hữu. Cơ sở mới luôn ở trạng thái Chờ duyệt và chưa hoạt động cho tới khi được duyệt.</p>
      </div>

      <form onSubmit={handleCreateHotel} className="glass-panel" style={{ borderRadius: '18px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 110px', gap: '12px' }}>
        <select value={form.idchusohuu} onChange={e => setForm({ ...form, idchusohuu: e.target.value })} style={inputStyle}>
          <option value="" style={optionStyle}>Chọn chủ sở hữu</option>
          {owners.map(owner => (
            <option key={owner.username} value={owner.profile?.idchusohuu} style={optionStyle}>{owner.profile?.idchusohuu || owner.username} - {owner.profile?.hoten || owner.username}</option>
          ))}
        </select>
        <input placeholder="Tên cơ sở" value={form.tencoso} onChange={e => setForm({ ...form, tencoso: e.target.value })} style={inputStyle} />
        <input type="number" min="1" max="5" value={form.sosao} onChange={e => setForm({ ...form, sosao: e.target.value })} style={inputStyle} />
        <input placeholder="Địa chỉ" value={form.diachi} onChange={e => setForm({ ...form, diachi: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / 3' }} />
        <button style={buttonStyle}>Tạo chờ duyệt</button>
        <textarea placeholder="Mô tả" value={form.mota} onChange={e => setForm({ ...form, mota: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / 4', minHeight: '76px' }} />
      </form>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))', gap: '12px' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inputStyle}>
          <option value="all" style={optionStyle}>Tất cả trạng thái</option>
          <option value="Chờ duyệt" style={optionStyle}>Chờ duyệt</option>
          <option value="Đang hoạt động" style={optionStyle}>Đang hoạt động</option>
          <option value="Từ chối" style={optionStyle}>Từ chối</option>
        </select>
        <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)} style={inputStyle}>
          <option value="" style={optionStyle}>Lọc theo chủ sở hữu</option>
          {owners.map(owner => (
            <option key={owner.username} value={owner.profile?.idchusohuu} style={optionStyle}>{owner.profile?.hoten || owner.username}</option>
          ))}
        </select>
        <select value={hotelFilter} onChange={e => setHotelFilter(e.target.value)} style={inputStyle}>
          <option value="" style={optionStyle}>Lọc/chọn cơ sở</option>
          {hotels.map(hotel => (
            <option key={hotel.idcoso} value={hotel.idcoso} style={optionStyle}>{hotel.idcoso} - {hotel.tencoso}</option>
          ))}
        </select>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--accent)', margin: 0 }}>Kết quả lọc cơ sở</h3>
          <strong style={{ color: 'var(--text-primary)' }}>{filteredHotels.length} cơ sở</strong>
        </div>
        {filteredHotels.map(hotel => (
          <div key={hotel.idcoso} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 260px', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <strong style={{ color: 'var(--accent)' }}>{hotel.idcoso}</strong>
            <div><strong style={{ color: 'var(--text-primary)' }}>{hotel.tencoso}</strong><br />{hotel.diachi}<br /><span>Chủ sở hữu: {hotel.owner?.hoten || hotel.idchusohuu}</span></div>
            <span>{hotel.trangthai}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleStatus(hotel.idcoso, 'Đang hoạt động')} style={buttonStyle}>Duyệt</button>
              <button onClick={() => handleStatus(hotel.idcoso, 'Từ chối')} style={buttonStyle}>Từ chối</button>
              <button onClick={() => handleStatus(hotel.idcoso, 'Chờ duyệt')} style={buttonStyle}>Chờ duyệt</button>
            </div>
          </div>
        ))}
        {filteredHotels.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Không có cơ sở phù hợp bộ lọc.</div>}
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--accent)', margin: 0 }}>Đơn/cơ sở chờ duyệt nhanh</h3>
          <strong style={{ color: 'var(--text-primary)' }}>{pendingHotels.length} cơ sở</strong>
        </div>
        {pendingHotels.map(hotel => (
          <div key={hotel.idcoso} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 260px', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <strong style={{ color: 'var(--accent)' }}>{hotel.idcoso}</strong>
            <div><strong style={{ color: 'var(--text-primary)' }}>{hotel.tencoso}</strong><br />{hotel.diachi}<br /><span>Chủ sở hữu: {hotel.owner?.hoten || hotel.idchusohuu}</span></div>
            <span>{hotel.trangthai}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleStatus(hotel.idcoso, 'Đang hoạt động')} style={buttonStyle}>Duyệt</button>
              <button onClick={() => handleStatus(hotel.idcoso, 'Từ chối')} style={buttonStyle}>Từ chối</button>
            </div>
          </div>
        ))}
        {pendingHotels.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Hiện chưa có cơ sở nào đang chờ duyệt.</div>}
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--accent)', margin: 0 }}>Tất cả cơ sở đã xử lý</h3>
          <strong style={{ color: 'var(--text-primary)' }}>{otherHotels.length} cơ sở</strong>
        </div>
        {otherHotels.map(hotel => (
          <div key={hotel.idcoso} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px 180px', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <strong style={{ color: 'var(--accent)' }}>{hotel.idcoso}</strong>
            <div><strong style={{ color: 'var(--text-primary)' }}>{hotel.tencoso}</strong><br />{hotel.diachi}<br /><span>Chủ sở hữu: {hotel.owner?.hoten || hotel.idchusohuu}</span></div>
            <span style={{ color: hotel.trangthai === 'Đang hoạt động' ? '#10b981' : '#ef4444', fontWeight: 800 }}>{hotel.trangthai}</span>
            <button onClick={() => handleStatus(hotel.idcoso, 'Chờ duyệt')} style={buttonStyle}>Đưa về chờ duyệt</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = { background: 'rgba(192,132,252,0.14)', border: '1px solid rgba(192,132,252,0.45)', borderRadius: '8px', color: '#c084fc', padding: '8px 12px', cursor: 'pointer', fontWeight: 800 };
const inputStyle = { background: '#101820', color: 'var(--text-primary)', colorScheme: 'dark', border: '1px solid rgba(245,158,11,0.32)', borderRadius: '10px', padding: '12px', outline: 'none' };
const optionStyle = { background: '#101820', color: '#f8fafc' };

export default ApproveHotel;
