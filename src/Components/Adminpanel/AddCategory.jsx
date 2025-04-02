import React, { useState } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    category_name: '', // Changed to match backend field name
    image: null,
    setPopular: false,
    setHomePageTop: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status states
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      // Create form data to send to API
      const apiData = {
        category_name: formData.category_name
      };
      
      // Make the API call
      const response = await axios.post(`${baseurl}/api/category/add`, apiData);
      
      // console.log('Category added successfully:', response.data);
      setSuccess('Category added successfully!');
      
      // Reset form
      setFormData({
        category_name: '',
        image: null,
        setPopular: false,
        setHomePageTop: false
      });

      setTimeout(() => {
        navigate('/parent-categories');
      }, 1000);
      
    } catch (err) {
      console.error('Error adding category:', err);
      setError(err.response?.data?.message || 'Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Add Main Category</h5>
              
              {/* Show success message */}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              
              {/* Show error message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Category Name */}
                <div className="mb-3">
                  <label htmlFor="category_name" className="form-label">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control w-50"
                    id="category_name" 
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn px-4 py-2"
                  style={{ backgroundColor: '#0133dc', color:'white' }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;