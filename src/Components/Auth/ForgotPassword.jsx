import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';
import baseurl from '../ApiService/ApiService';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setMessage({ text: '', type: '' });
      
      try {
        // Call the API endpoint
        const response = await axios.post(`${baseurl}/api/admin/forgot-password`, {
          email: formData.email,
          newPassword: formData.newPassword
        });
        
        // Handle successful password reset
        setMessage({
          text: 'Password has been reset successfully. Redirecting to login...',
          type: 'success'
        });
        
        // Clear form
        setFormData({
          email: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 3000);
        
      } catch (error) {
        // Handle errors
        const errorMessage = error.response?.data?.msg || 'An error occurred while resetting the password';
        setMessage({
          text: errorMessage,
          type: 'danger'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="container-fluid min-vh-100 adminback">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Reset Your Password</h2>
              <p className="text-center text-muted mb-4">
                Enter your email and new password below
              </p>

              {message.text && (
                <div className={`alert alert-${message.type} mb-4`} role="alert">
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className={`form-control form-control-lg ${errors.newPassword ? 'is-invalid' : ''}`}
                    placeholder="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-primary" 
                    onClick={toggleNewPasswordVisibility}
                    style={{ zIndex: 10 }}
                  >
                    <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )}
                </div>

                <div className="mb-4 position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirm New Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn position-absolute top-50 end-0 translate-middle-y bg-transparent border-0 text-primary" 
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ zIndex: 10 }}
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </span>
                  ) : (
                    'Reset Password'
                  )}
                </button>

                <div className="text-center">
                  <a href="/admin/login" className="text-primary text-decoration-none">
                    Back to Login
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;