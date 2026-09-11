import React, { useState } from 'react';
import api from '../../services/api';

const UserForm = ({ onClose, onSuccess, initialData, isEdit }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', email: '', password: '', role: 'user', address: ''
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear individual field error on change
    setFieldErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;

    if (!formData.name) {
      errors.name = 'Name is required.';
    } else if (formData.name.length < 20 || formData.name.length > 60) {
      errors.name = 'Name must be 20–60 characters.';
    }
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Valid email is required.';
    }
    if (!formData.password && !isEdit) {
      errors.password = 'Password is required.';
    } else if (formData.password && !passwordRegex.test(formData.password)) {
      errors.password = 'Password: 8–16 chars, 1 uppercase, 1 special character (!@#$%^&*).';
    }
    if (!formData.role) {
      errors.role = 'Role is required.';
    }
    if (formData.address && formData.address.length > 400) {
      errors.address = 'Address cannot exceed 400 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      if (isEdit) {
        await api.put(`/admin/users/${initialData.user_id}`, formData);
      } else {
        await api.post('/admin/users', formData);
      }
      onSuccess();
    } catch (err) {
      setServerError(err.response?.data?.error || `Failed to ${isEdit ? 'update' : 'create'} user`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#fff', borderRadius:16, padding:36, width:'90%', maxWidth:460, boxShadow:'0 20px 60px rgba(0,0,0,.15)', maxHeight:'90vh', overflowY:'auto' }}>
        <h3 style={{ marginBottom:20, color:'#0f172a' }}>{isEdit ? 'Edit User' : 'Create New User'}</h3>

        {serverError && <p className="form-error">{serverError}</p>}

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* Name */}
          <div>
            <label>Full Name <span style={{ color:'#94a3b8', fontWeight:400 }}>(20–60 chars)</span></label>
            <input name="name" type="text" value={formData.name} onChange={handleChange}
              placeholder="e.g. Prathamesh Vaman Kokare" disabled={isLoading} />
            {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            <span style={{ fontSize:'0.78rem', color:'#94a3b8' }}>{formData.name.length}/60 characters</span>
          </div>

          {/* Email */}
          <div>
            <label>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange}
              placeholder="user@example.com" disabled={isLoading} />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label>Password <span style={{ color:'#94a3b8', fontWeight:400 }}>{isEdit ? '(leave blank to keep current)' : '(8–16 chars, 1 uppercase, 1 special)'}</span></label>
            <input name="password" type="password" value={formData.password} onChange={handleChange}
              placeholder={isEdit ? "Leave blank to keep unchanged" : "e.g. Hello@123"} disabled={isLoading} />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          {/* Role */}
          <div>
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} disabled={isLoading}>
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            {fieldErrors.role && <span className="field-error">{fieldErrors.role}</span>}
          </div>

          {/* Address */}
          <div>
            <label>Address <span style={{ color:'#94a3b8', fontWeight:400 }}>(optional)</span></label>
            <input name="address" type="text" value={formData.address} onChange={handleChange}
              placeholder="City, State..." disabled={isLoading} />
            {fieldErrors.address && <span className="field-error">{fieldErrors.address}</span>}
          </div>

          <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:8 }}>
            <button type="button" onClick={onClose} disabled={isLoading}
              style={{ background:'#f1f5f9', color:'#475569', boxShadow:'none' }}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
