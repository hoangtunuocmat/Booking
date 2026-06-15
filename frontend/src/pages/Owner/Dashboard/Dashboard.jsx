import React, { useEffect, useMemo, useState } from 'react';
import { Building2, ClipboardCheck, MapPin, Star, Wallet } from 'lucide-react';
import { ownerApi } from '../../../api/ownerApi';
import { useAuth } from '../../../context/AuthContext';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const ownerId = profile?.idchusohuu || profile?.username || user?.id || user?.username;
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    setLoading(true);
    ownerApi.getDashboard(ownerId)
      .then(res => setDashboard(res.data?.data || null))
      .catch(err => console.error('Owner dashboard error:', err))
      .finally(() => setLoading(false));
  }, [ownerId]);

  const cards = useMemo(() => [
    { label: 'Cơ sở lưu trú', value: dashboard?.totalHotels ?? 0, icon: <Building2 size={24} /> },
    { label: 'Đơn trong tháng', value: dashboard?.monthlyOrders ?? 0, icon: <ClipboardCheck size={24} /> },
    { label: 'Doanh thu', value: `${Number(dashboard?.revenue || 0).toLocaleString('vi-VN')}đ`, icon: <Wallet size={24} /> },
  ], [dashboard]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>Dashboard chủ khách sạn</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Theo dõi báo cáo, thống kê doanh thu và trạng thái vận hành.</p>
      </div>

      {loading && <div style={{ color: 'var(--accent)' }}>Đang tải dữ liệu từ Supabase...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
        {cards.map((card) => (
          <div key={card.label} className="glass-panel" style={{ borderRadius: '18px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{card.label}</div>
              <div style={{ color: 'var(--accent)', fontSize: '30px', fontWeight: 900 }}>{card.value}</div>
            </div>
            <div style={{ color: 'var(--accent)' }}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ color: 'var(--accent)', marginBottom: '4px' }}>Cơ sở đang quản lý</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '13px' }}>Danh sách khách sạn/cơ sở lưu trú thuộc tài khoản chủ sở hữu hiện tại.</p>
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 900 }}>{dashboard?.hotels?.length || 0} cơ sở</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {(dashboard?.hotels || []).map(hotel => (
            <div key={hotel.idcoso} style={{ border: '1px solid rgba(212,163,89,0.18)', borderRadius: '16px', padding: '18px', background: 'rgba(255,255,255,0.025)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>{hotel.tencoso}</strong>
                <span style={{ color: 'var(--accent)', fontWeight: 900 }}>{hotel.idcoso}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
                <MapPin size={14} color="var(--accent)" /> {hotel.diachi}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--accent)', fontWeight: 800 }}><Star size={14} fill="var(--accent)" /> {hotel.sosao} sao</span>
                <span style={{ color: hotel.trangthai === 'Đang hoạt động' ? '#10b981' : 'var(--accent)', fontWeight: 800 }}>{hotel.trangthai}</span>
              </div>
            </div>
          ))}
          {!dashboard?.hotels?.length && <div style={{ color: 'var(--text-secondary)' }}>Tài khoản này chưa quản lý cơ sở lưu trú nào.</div>}
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '22px' }}>
        <h3 style={{ color: 'var(--accent)', marginBottom: '16px' }}>Đơn gần đây</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(dashboard?.recentOrders || []).map(order => (
            <div key={order.iddatphong} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{order.iddatphong}</strong>
              <span>{order.customer?.hoten || order.idkhachhang}</span>
              <span>{order.hotel?.tencoso || 'Cơ sở lưu trú'}</span>
              <span style={{ color: 'var(--accent)' }}>{order.trangthai}</span>
            </div>
          ))}
          {!dashboard?.recentOrders?.length && <div style={{ color: 'var(--text-secondary)' }}>Chưa có đơn đặt phòng.</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
