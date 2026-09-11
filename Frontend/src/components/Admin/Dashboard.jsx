import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ 
    totalUsers: 0, 
    totalStores: 0, 
    totalRatings: 0,
    recentUsers: [],
    recentStores: [],
    recentRatings: []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/admin/dashboard');
        // Backend returns: { totalUsers, totalStores, totalRatings }
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#6366f1' },
    { label: 'Total Stores', value: stats.totalStores, icon: '🏪', color: '#10b981' },
    { label: 'Total Ratings', value: stats.totalRatings, icon: '⭐', color: '#f59e0b' },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Platform overview at a glance</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      {isLoading ? (
        <p className="loading-text">Loading stats...</p>
      ) : (
        <div className="stats-grid">
          {cards.map(card => (
            <div key={card.label} className="stat-card-new" style={{ '--accent': card.color }}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-info">
                <p className="stat-label">{card.label}</p>
                <p className="stat-value">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="recent-activity-container" style={{ marginTop: '40px', paddingBottom: '40px' }}>
          <h3 style={{ fontSize: '1.4rem', color: '#1e293b', marginBottom: '20px' }}>Recent Activities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Recent Users */}
            <div className="activity-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                👥 Newest Users
              </h4>
              {stats.recentUsers && stats.recentUsers.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.recentUsers.map(user => (
                    <li key={user.user_id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{user.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', display:'flex', justifyContent:'space-between', marginTop: '4px' }}>
                        <span>{user.email}</span>
                        <span style={{ 
                          textTransform: 'capitalize', 
                          color: user.role === 'admin' ? '#ef4444' : user.role === 'owner' ? '#10b981' : '#6366f1',
                          fontWeight: '600'
                        }}>
                          {user.role}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: '#94a3b8' }}>No recent users.</p>}
            </div>

            {/* Recent Stores */}
            <div className="activity-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏪 Newest Stores
              </h4>
              {stats.recentStores && stats.recentStores.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.recentStores.map(store => (
                    <li key={store.store_id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{store.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                        Added on {new Date(store.created_at).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: '#94a3b8' }}>No recent stores.</p>}
            </div>

            {/* Recent Ratings */}
            <div className="activity-card" style={{ background: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 20px 0', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⭐ Recent Ratings
              </h4>
              {stats.recentRatings && stats.recentRatings.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.recentRatings.map(rating => (
                    <li key={rating.rating_id} style={{ paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#fbbf24', letterSpacing: '2px' }}>
                          {'★'.repeat(rating.rating_value)}{'☆'.repeat(5 - rating.rating_value)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginLeft: '6px' }}>
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.4' }}>
                        "{rating.review_text}"
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p style={{ color: '#94a3b8' }}>No recent ratings.</p>}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
