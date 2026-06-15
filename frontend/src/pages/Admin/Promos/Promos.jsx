import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/adminApi';

const Promos = () => {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ tenkhuyenmai: '', mota: '', phantramgiam: 10, ngaybatdau: '', ngayketthuc: '', macode: '', soluong: 100 });

  const loadPromos = () => adminApi.getPromos().then(res => setPromos(res.data?.data || []));
  useEffect(() => { loadPromos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tenkhuyenmai || !form.macode || !form.ngaybatdau || !form.ngayketthuc) return alert('Vui lòng nhập đủ thông tin khuyến mãi.');
    await adminApi.createPromo(form);
    setForm({ tenkhuyenmai: '', mota: '', phantramgiam: 10, ngaybatdau: '', ngayketthuc: '', macode: '', soluong: 100 });
    loadPromos();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)' }}>Khuyến mãi & mã giảm giá</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Tạo chiến dịch KhuyenMai và MaGiamGia.</p>
      </div>
      <form onSubmit={handleSubmit} className="glass-panel" style={{ borderRadius: '18px', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px' }}>
        <input placeholder="Tên khuyến mãi" value={form.tenkhuyenmai} onChange={e => setForm({ ...form, tenkhuyenmai: e.target.value })} style={inputStyle} />
        <input placeholder="Mã code" value={form.macode} onChange={e => setForm({ ...form, macode: e.target.value.toUpperCase() })} style={inputStyle} />
        <input type="number" value={form.phantramgiam} onChange={e => setForm({ ...form, phantramgiam: e.target.value })} style={inputStyle} />
        <input type="date" value={form.ngaybatdau} onChange={e => setForm({ ...form, ngaybatdau: e.target.value })} style={inputStyle} />
        <input type="date" value={form.ngayketthuc} onChange={e => setForm({ ...form, ngayketthuc: e.target.value })} style={inputStyle} />
        <input type="number" value={form.soluong} onChange={e => setForm({ ...form, soluong: e.target.value })} style={inputStyle} />
        <textarea placeholder="Mô tả" value={form.mota} onChange={e => setForm({ ...form, mota: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / 3' }} />
        <button style={buttonStyle}>Tạo mã</button>
      </form>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        {promos.map(promo => (
          <div key={promo.idkhuyenmai} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 100px 1fr', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <strong style={{ color: 'var(--accent)' }}>{promo.idkhuyenmai}</strong>
            <span>{promo.tenkhuyenmai}</span>
            <span>{promo.phantramgiam}%</span>
            <span>{promo.codes?.map(code => code.macode).join(', ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const inputStyle = { background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px', outline: 'none' };
const buttonStyle = { background: 'linear-gradient(135deg,#c084fc,#a855f7)', border: 'none', borderRadius: '10px', color: '#070708', fontWeight: 900, cursor: 'pointer' };

export default Promos;
