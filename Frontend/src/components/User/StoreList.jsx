import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Common/Navbar';
import Footer from '../Common/Footer';

const userLinks = [
  { to: '/stores', label: 'Stores', icon: '🏪' },
];

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratings, setRatings] = useState({});
  const { user } = useContext(AuthContext);

  const fetchStores = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/stores', { params: { search } });
      const fetchedStores = res.data.stores || res.data || [];
      setStores(fetchedStores);

      // Pre-fill rating inputs with user's existing ratings
      const initialRatings = {};
      fetchedStores.forEach(store => {
        initialRatings[store.store_id] = {
          value: store.user_rating || '',
          review: '',
          submitting: false,
          success: '',
          error: ''
        };
      });
      setRatings(prev => ({ ...initialRatings, ...prev }));
    } catch (err) {
      setError('Failed to load stores. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchStores();
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const handleRatingChange = (storeId, field, value) => {
    setRatings(prev => ({
      ...prev,
      [storeId]: { ...prev[storeId], [field]: value, success: '', error: '' }
    }));
  };

  const handleSubmitRating = async (storeId) => {
    const rating = ratings[storeId];
    if (!rating?.value) {
      setRatings(prev => ({
        ...prev,
        [storeId]: { ...prev[storeId], error: 'Please select a rating (1-5).' }
      }));
      return;
    }

    setRatings(prev => ({
      ...prev,
      [storeId]: { ...prev[storeId], submitting: true, error: '', success: '' }
    }));

    try {
      await api.post('/ratings', {
        store_id: storeId,
        rating_value: Number(rating.value),
        review_text: rating.review || undefined
      });
      setRatings(prev => ({
        ...prev,
        [storeId]: { ...prev[storeId], submitting: false, success: 'Rating submitted!' }
      }));
      fetchStores(); // Refresh to show updated avg
    } catch (err) {
      setRatings(prev => ({
        ...prev,
        [storeId]: {
          ...prev[storeId],
          submitting: false,
          error: err.response?.data?.message || 'Failed to submit rating.'
        }
      }));
    }
  };

  return (
    <div className="layout-wrapper">
      <Navbar links={userLinks} />

      <main className="main-content">
        <div className="store-list-content">
          <div className="page-heading">
            <h1>Browse Stores</h1>
            <p className="page-subtitle">Find and rate stores in your area</p>
          </div>

          {/* Search */}
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-bar"
              placeholder="🔍  Search stores by name or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {error && <p className="form-error">{error}</p>}
          {isLoading && <p className="loading-text">Loading stores...</p>}

          {!isLoading && stores.length === 0 && (
            <p className="no-stores">No stores found.</p>
          )}

          {/* Store Cards */}
          <div className="store-grid">
            {stores.map(store => {
              const r = ratings[store.store_id] || {};
              return (
                <div key={store.store_id} className="store-card">
                  <div className="store-card-top">
                    <h2 className="store-name">{store.name}</h2>
                    <div className="store-rating-badge">
                      ⭐ {store.avg_rating ? Number(store.avg_rating).toFixed(1) : 'N/A'}
                    </div>
                  </div>
                  <p className="store-address">📍 {store.address}</p>
                  <p className="store-meta">{store.total_ratings || 0} ratings</p>

                  {store.user_rating && (
                    <p className="your-rating">Your current rating: <strong>{store.user_rating}</strong> / 5</p>
                  )}

                  {/* Rating Form */}
                  <div className="rating-form">
                    <label>Your Rating</label>
                    <select
                      value={r.value || ''}
                      onChange={e => handleRatingChange(store.store_id, 'value', e.target.value)}
                      disabled={r.submitting}
                    >
                      <option value="">-- Select --</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>

                    <label style={{ marginTop: '8px' }}>Review (optional)</label>
                    <textarea
                      placeholder="Write a short review..."
                      value={r.review || ''}
                      onChange={e => handleRatingChange(store.store_id, 'review', e.target.value)}
                      disabled={r.submitting}
                      rows={2}
                    />

                    {r.error && <span className="field-error">{r.error}</span>}
                    {r.success && <span className="field-success">{r.success}</span>}

                    <button
                      className="rate-btn"
                      onClick={() => handleSubmitRating(store.store_id)}
                      disabled={r.submitting}
                    >
                      {r.submitting ? 'Submitting...' : store.user_rating ? 'Update Rating' : 'Submit Rating'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StoreList;

