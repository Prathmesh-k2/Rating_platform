import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters.';
    }
    
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters long, contain at least 1 uppercase letter and 1 special character (!@#$%^&*).';
    }

    if (formData.address.length > 400) {
      newErrors.address = 'Address cannot exceed 400 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    
    try {
      await signup(formData);
      // Redirect to login upon successful registration
      navigate('/login');
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      {formError && <p style={{ color: 'red', fontWeight: 'bold' }}>{formError}</p>}
      
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          {errors.name && <span style={{ color: 'red', fontSize: '12px' }}>{errors.name}</span>}
        </div>
        
        <div>
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>
        
        <div>
          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            disabled={isLoading}
            style={{ width: '100%' }}
          />
          {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div>
          <label>Address</label>
          <textarea 
            name="address"
            value={formData.address} 
            onChange={handleChange} 
            disabled={isLoading}
            style={{ width: '100%', minHeight: '60px' }}
          />
          {errors.address && <span style={{ color: 'red', fontSize: '12px' }}>{errors.address}</span>}
        </div>
        
        <button type="submit" disabled={isLoading} style={{ padding: '10px' }}>
          {isLoading ? 'Signing up (Spinner)...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
