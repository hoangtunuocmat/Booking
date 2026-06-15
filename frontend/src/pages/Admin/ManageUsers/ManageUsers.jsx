import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../api/adminApi';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => adminApi.getUsers().then(res => setUsers(res.data?.data || []));
  useEffect(() => { loadUsers(); }, []);

  const handleStatus = async (username, trangthai) => {
    await adminApi.updateUserStatus(username, trangthai);
    loadUsers();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ color: 'var(--text-primary)' }}>Quản lý tài khoản</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Khóa hoặc mở lại tài khoản vi phạm.</p>
      </div>
      <div className="glass-panel" style={{ borderRadius: '18px', padding: '24px' }}>
        {users.map(user => (
          <div key={user.username} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 130px 130px 190px', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
            <strong style={{ color: 'var(--accent)' }}>{user.username}</strong>
            <span>{user.profile?.hoten || user.profile?.email || 'Chưa có hồ sơ'}</span>
            <span>{user.vaitro}</span>
            <span>{user.trangthai}</span>
            <button onClick={() => handleStatus(user.username, user.trangthai === 'Hoạt động' ? 'Khóa' : 'Hoạt động')} style={buttonStyle}>{user.trangthai === 'Hoạt động' ? 'Khóa tài khoản' : 'Mở khóa'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const buttonStyle = { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', color: '#ef4444', padding: '8px 12px', cursor: 'pointer', fontWeight: 800 };

export default ManageUsers;
