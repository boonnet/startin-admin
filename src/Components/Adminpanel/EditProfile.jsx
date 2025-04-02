import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Fetch current admin profile on component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          // Redirect to login if no token
          // history.push('/login'); // Uncomment if using react-router
          return;
        }

        const response = await axios.get(`${baseurl}/api/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setFormData({
            username: response.data.data.username,
            email: response.data.data.email
          });
        }
      } catch (error) {
        setMessage({
          type: 'danger',
          text: error.response?.data?.msg || 'Failed to fetch profile'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.put(`${baseurl}/api/admin/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update token if returned from server
        if (response.data.accessToken) {
          localStorage.setItem('adminToken', response.data.accessToken);
        }
        
        setMessage({
          type: 'success',
          text: 'Profile updated successfully!'
        });
      }
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.msg || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="card border-0">
            <div className="card-body">
              <h5 className="card-title mb-4">Edit Admin Settings</h5>
              
              {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                  {message.text}
                  <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    id="username"
                    placeholder="Admin Name"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control"
                    id="email"
                    placeholder="Admin Mail ID"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  style={{backgroundColor:'#0133dc', color:'white'}}
                  className="btn px-4"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;