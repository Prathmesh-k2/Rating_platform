import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import UserForm from './UserForm';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('user_id');
  const [order, setOrder] = useState('ASC');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users', {
        params: { search, sortBy, order, role: roleFilter || undefined }
      });
      setUsers(res.data.data || res.data); // Support { data: [...] } format
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, sortBy, order, roleFilter]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setOrder('ASC');
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    setEditUser(null);
    fetchUsers(); 
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? It will also delete their stores and ratings.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
        alert(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="management-container" style={{ padding: '20px' }}>
      <h2>User Management</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Search users..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px', width: '250px' }}
        />
        <button onClick={() => { setEditUser(null); setShowModal(true); }}>+ Add User</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
        {['All', 'Admin', 'Owner', 'User'].map(r => {
          const apiRole = r === 'All' ? '' : r.toLowerCase();
          const isActive = roleFilter === apiRole;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(apiRole)}
              style={{
                background: isActive ? '#6366f1' : 'transparent',
                color: isActive ? '#fff' : '#64748b',
                boxShadow: 'none',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '20px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer'
              }}
            >
              {r}
            </button>
          )
        })}
      </div>

      {isLoading ? <p>Loading users...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc' }}>
              <th onClick={() => handleSort('user_id')} style={{ cursor: 'pointer', padding: '10px' }}>ID {sortBy === 'user_id' ? (order === 'ASC' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', padding: '10px' }}>Name {sortBy === 'name' ? (order === 'ASC' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer', padding: '10px' }}>Email {sortBy === 'email' ? (order === 'ASC' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', padding: '10px' }}>Role {sortBy === 'role' ? (order === 'ASC' ? '↑' : '↓') : ''}</th>
              <th style={{ padding: '10px' }}>Address</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.user_id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{user.user_id}</td>
                <td style={{ padding: '10px' }}>{user.name}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>{user.role}</td>
                <td style={{ padding: '10px' }}>{user.address}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => { setEditUser({ ...user, password: '' }); setShowModal(true); }} style={{ marginRight: 8, padding: '4px 8px', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={() => handleDelete(user.user_id)} style={{ padding: '4px 8px', fontSize: '0.85rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>Delete</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {showModal && <UserForm onClose={() => { setShowModal(false); setEditUser(null); }} onSuccess={handleSuccess} initialData={editUser} isEdit={!!editUser} />}
    </div>
  );
};

export default UserManagement;
