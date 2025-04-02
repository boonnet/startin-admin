import React, { useState } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const ChangePassword = () => {
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        // Get token from localStorage or wherever you store it
        const token = localStorage.getItem('adminToken');
        
        const response = await axios.put(`${baseurl}/api/admin/change-password`, 
          {
            newPassword: passwordData.newPassword,
            confirmPassword: passwordData.confirmPassword
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setMessage({ text: 'Password updated successfully!', type: 'success' });
          // Reset form
          setPasswordData({
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.msg || 'An error occurred';
        setMessage({ text: errorMessage, type: 'danger' });
      } finally {
        setLoading(false);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h5>Change Password</h5>
          
          {message.text && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.newPassword && (
                  <div className="invalid-feedback">{errors.newPassword}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn"
              style={{backgroundColor:'#0133dc', color:'white'}} 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;