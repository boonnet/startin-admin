import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';
import axios from 'axios'; // Make sure to install axios: npm install axios
import baseurl from '../ApiService/ApiService';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    // Clear API error when user modifies the form
    if (apiError) {
      setApiError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        setApiError('');
        
        // Remove confirmPassword from the data sent to API
        const { confirmPassword, ...apiData } = formData;
        
        // Make API call to register endpoint
        const response = await axios.post(`${baseurl}/api/admin/register`, apiData);
        
        // console.log('Registration successful:', response.data);
        setSuccess(response.data.msg || 'Registration Successful!');
        
        // Clear the form
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Optionally redirect to login page after success
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
        
      } catch (error) {
        console.error('Registration error:', error);
        
        // Handle API errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
            // Handle validation errors returned by express-validator
            const serverErrors = {};
            error.response.data.errors.forEach(err => {
              serverErrors[err.param] = err.msg;
            });
            setErrors(serverErrors);
          } else {
            // Handle general error message
            setApiError(error.response.data.msg || 'Registration failed. Please try again.');
          }
        } else if (error.request) {
          // The request was made but no response was received
          setApiError('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setApiError('An error occurred. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 adminback">
      <div className="row min-vh-100 align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Create an Account</h2>
              <p className="text-center text-muted mb-4">
                Already have an account?{' '}
                <a href="/admin/login" className="text-primary text-decoration-none">
                  Login
                </a>
              </p>

              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

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
                    type={showPassword ? "text" : "password"}
                    className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                    onClick={togglePasswordVisibility}
                    style={{ zIndex: 5 }}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-4 position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ zIndex: 5 }}
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
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;