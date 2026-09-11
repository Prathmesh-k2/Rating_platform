import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const ownerLinks = [
  { to: '/store-owner/dashboard', label: 'Dashboard', icon: '📊' },
];

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({ stores: [], recent_ratings: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/store-owner/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.dashboard);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const ratingColor = (val) => {
    if (!val) return '#94a3b8';
    const n = Number(val);
    if (n >= 4) return '#059669';
    if (n >= 3) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="layout-wrapper">
      <Navbar links={ownerLinks} />

      <main className="main-content">
        <div className="page-heading">
          <h1>Store Owner Dashboard</h1>
          <p className="page-subtitle">Track your stores and recent reviews</p>
        </div>

        {error && <p className="form-error">{error}</p>}
        {isLoading && <p className="loading-text">Loading dashboard...</p>}

        {!isLoading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* My Stores */}
            <div className="management-container">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>My Stores</h2>
              {dashboardData.stores.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>You don't have any stores yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Store Name</th>
                      <th>Address</th>
                      <th>Avg Rating</th>
                      <th>Total Ratings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.stores.map(store => (
                      <tr key={store.store_id}>
                        <td>{store.store_id}</td>
                        <td style={{ fontWeight: 600 }}>{store.name}</td>
                        <td>{store.address || '—'}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Recent Ratings / Reviews */}
            <div className="management-container">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Recent Feedback</h2>
              {dashboardData.recent_ratings.length === 0 ? (
                <p style={{ color: '#94a3b8' }}>No feedback received yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {dashboardData.recent_ratings.map(rating => (
                    <div key={rating.rating_id} style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      background: '#f8fafc'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ color: '#0f172a' }}>{rating.user_name}</strong>
                          <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '8px' }}>
                            rated <strong>{rating.store_name}</strong>
                          </span>
                        </div>
                        <span style={{
                          color: ratingColor(rating.rating_value),
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}>
                          {rating.rating_value} / 5
                        </span>
                      </div>
                      <p style={{ color: '#334155', margin: '4px 0 0 0', fontStyle: rating.review_text ? 'normal' : 'italic', fontSize: '0.95rem' }}>
                        {rating.review_text || 'No review text provided.'}
                      </p>
                      <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '8px', textAlign: 'right' }}>
                        {new Date(rating.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StoreOwnerDashboard;
