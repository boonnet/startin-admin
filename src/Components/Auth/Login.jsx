import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Auth.css';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Call the login API endpoint
      const response = await axios.post(`${baseurl}/api/admin/login`, formData);
      
      // If login is successful
      if (response.data.success) {
        // Store the token in localStorage for future requests
        localStorage.setItem('adminToken', response.data.accessToken);
        localStorage.setItem('adminData', JSON.stringify(response.data.data));
        
        // Redirect to admin dashboard or home page
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Handle login failure
      if (error.response && error.response.data) {
        setError(error.response.data.msg || 'Login failed. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 adminback">
      <div className="row min-vh-100 align-items-center justify-content-center">
        {/* Login form */}
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Login to your Account</h2>
              <p className="text-center text-muted mb-4">
                Don't have an account?{' '}
                <a href="/admin/register" className="text-primary text-decoration-none">
                  Sign Up!
                </a>
              </p>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="btn position-absolute end-0 top-50 translate-middle-y bg-transparent border-0" 
                    onClick={togglePasswordVisibility}
                    style={{ zIndex: 5 }}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                  </button>
                </div>

                <div className="mb-4 text-end">
                  <a href="/admin/forgotpassword" className="text-primary text-decoration-none">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg mb-4"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;