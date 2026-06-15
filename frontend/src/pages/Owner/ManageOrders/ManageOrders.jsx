import React, { useEffect, useState } from 'react';
import { ownerApi } from '../../../api/ownerApi';
import { useAuth } from '../../../context/AuthContext';

const ManageOrders = () => {
  const { user, profile } = useAuth();
  const ownerId = profile?.idchusohuu || profile?.username || user?.id || user?.username;
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    if (!ownerId) return;
    ownerApi.getOrders(ownerId)
      .then(res => setOrders(res.data?.data || []))
      .catch(err => console.error('Owner orders error:', err));
  };

  useEffect(loadOrders, [ownerId]);

  const handleStatus = async (bookingId, status) => {
    await ownerApi.updateOrderStatus(bookingId, status);
    loadOrders();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '6px' }}>Quản lý đơn đặt phòng</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Duyệt đơn đang chờ, xác nhận nhận phòng, hoàn thành hoặc hủy phòng.</p>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(order => (
            <div key={order.iddatphong} style={{ display: 'grid', gridTemplateColumns: '90px 1.5fr 1.5fr 130px 220px', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <strong style={{ color: 'var(--accent)' }}>{order.iddatphong}</strong>
              <span>{order.customer?.hoten || order.idkhachhang}</span>
              <span>{order.hotel?.tencoso || order.room?.tenphong}</span>
              <span>{order.trangthai}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleStatus(order.iddatphong, 'Đã xác nhận')} style={smallButton}>Xác nhận</button>
                <button onClick={() => handleStatus(order.iddatphong, 'Đã hoàn thành')} style={smallButton}>Hoàn thành</button>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Chưa có đơn đặt phòng.</div>}
        </div>
      </div>
    </div>
  );
};

const smallButton = { background: 'rgba(212,163,89,0.12)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--accent)', padding: '8px 10px', cursor: 'pointer', fontWeight: 800 };

export default ManageOrders;
