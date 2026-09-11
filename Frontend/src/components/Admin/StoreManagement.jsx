import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SortIcon = ({ column, sortBy, order }) => {
  if (sortBy !== column) return <span style={{ color: '#cbd5e1', marginLeft: 4 }}>↕</span>;
  return <span style={{ marginLeft: 4 }}>{order === 'ASC' ? '↑' : '↓'}</span>;
};

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('store_id');
  const [order, setOrder] = useState('ASC');
  const [showModal, setShowModal] = useState(false);
  const [editStoreId, setEditStoreId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ owner_id: '', name: '', email: '', address: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStores = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/stores', { params: { search } });
      let data = res.data.stores || res.data || [];

      // Client-side sort since /stores may not support all sort keys
      data = [...data].sort((a, b) => {
        const av = a[sortBy] ?? '';
        const bv = b[sortBy] ?? '';
        if (av < bv) return order === 'ASC' ? -1 : 1;
        if (av > bv) return order === 'ASC' ? 1 : -1;
        return 0;
      });

      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(fetchStores, 300);
    return () => clearTimeout(handler);
  }, [search, sortBy, order]);

  const handleSort = (column) => {
    if (sortBy === column) setOrder(o => o === 'ASC' ? 'DESC' : 'ASC');
    else { setSortBy(column); setOrder('ASC'); }
  };

  const handleSubmitStore = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);
    try {
      if (editStoreId) {
        await api.put(`/admin/stores/${editStoreId}`, formData);
      } else {
        await api.post('/admin/stores', formData);
      }
      setShowModal(false);
      setFormData({ owner_id: '', name: '', email: '', address: '' });
      setEditStoreId(null);
      fetchStores();
    } catch (err) {
      setFormError(err.response?.data?.error || `Failed to ${editStoreId ? 'update' : 'create'} store`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await api.delete(`/admin/stores/${id}`);
        fetchStores();
      } catch (err) {
        console.error('Failed to delete store', err);
        alert(err.response?.data?.error || 'Failed to delete store');
      }
    }
  };

  const ratingColor = (val) => {
    if (!val) return '#94a3b8';
    const n = Number(val);
    if (n >= 4) return '#059669';
    if (n >= 3) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="management-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Store Management</h2>
        <button onClick={() => { 
          setFormError(''); 
          setEditStoreId(null); 
          setFormData({ owner_id: '', name: '', email: '', address: '' }); 
          setShowModal(true); 
        }}>+ Add Store</button>
      </div>

      <input
        type="text"
        placeholder="🔍  Search stores..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 20, maxWidth: 300 }}
      />

      {isLoading ? <p className="loading-text">Loading stores...</p> : (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('store_id')} style={{ cursor: 'pointer' }}>
                ID <SortIcon column="store_id" sortBy={sortBy} order={order} />
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name <SortIcon column="name" sortBy={sortBy} order={order} />
              </th>
              <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                Email <SortIcon column="email" sortBy={sortBy} order={order} />
              </th>
              <th onClick={() => handleSort('address')} style={{ cursor: 'pointer' }}>
                Address <SortIcon column="address" sortBy={sortBy} order={order} />
              </th>
              <th onClick={() => handleSort('avg_rating')} style={{ cursor: 'pointer' }}>
                Avg Rating <SortIcon column="avg_rating" sortBy={sortBy} order={order} />
              </th>
              <th onClick={() => handleSort('total_ratings')} style={{ cursor: 'pointer' }}>
                Total Ratings <SortIcon column="total_ratings" sortBy={sortBy} order={order} />
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map(store => (
              <tr key={store.store_id}>
                <td>{store.store_id}</td>
                <td style={{ fontWeight: 600 }}>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: store.avg_rating ? '#f0fdf4' : '#f8fafc',
                    color: ratingColor(store.avg_rating),
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: `1px solid ${ratingColor(store.avg_rating)}40`
                  }}>
                    {store.avg_rating ? `⭐ ${Number(store.avg_rating).toFixed(1)}` : '—'}
                  </span>
                </td>
                <td style={{ color: '#475569' }}>{store.total_ratings || 0}</td>
                <td>
                  <button onClick={() => { 
                    setFormError(''); 
                    setEditStoreId(store.store_id); 
                    setFormData({
                      owner_id: store.owner_id,
                      name: store.name,
                      email: store.email,
                      address: store.address || ''
                    });
                    setShowModal(true); 
                  }} style={{ marginRight: 8, padding: '4px 8px', fontSize: '0.85rem' }}>Edit</button>
                  <button onClick={() => handleDelete(store.store_id)} style={{ padding: '4px 8px', fontSize: '0.85rem', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}>Delete</button>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: 32, color: '#94a3b8' }}>
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Add Store Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 36, minWidth: 360, width: '90%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
            <h3 style={{ marginBottom: 20, color: '#0f172a' }}>{editStoreId ? 'Edit Store' : 'Add New Store'}</h3>
            {formError && <p className="form-error">{formError}</p>}

            <form onSubmit={handleSubmitStore} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label>Owner ID</label>
                <input type="number" value={formData.owner_id} onChange={e => setFormData({ ...formData, owner_id: e.target.value })} required disabled={isSubmitting} />
              </div>
              <div>
                <label>Store Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required disabled={isSubmitting} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required disabled={isSubmitting} />
              </div>
              <div>
                <label>Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} disabled={isSubmitting} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting}
                  style={{ background: '#f1f5f9', color: '#475569', boxShadow: 'none' }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (editStoreId ? 'Updating...' : 'Creating...') : (editStoreId ? 'Update Store' : 'Create Store')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
