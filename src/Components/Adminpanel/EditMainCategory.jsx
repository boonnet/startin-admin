import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const EditMainCategory = () => {
  const [formData, setFormData] = useState({
    category_name: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/category/${id}`);
        setFormData({
          category_name: response.data.data.category_name
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError('Failed to load category data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status states
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    
    try {
      // Make the API call to update category
      const response = await axios.put(`${baseurl}/api/category/update/${id}`, {
        category_name: formData.category_name
      });
      
      setSuccess('Category updated successfully!');
      
      // Redirect to category list after short delay
      setTimeout(() => {
        navigate('/parent-categories');
      }, 1000);
      
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'Failed to update category. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Edit Category</h5>
              
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

                {/* Buttons */}
                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn px-4 py-2 me-2"
                    style={{ backgroundColor: '#0133dc', color: 'white' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Category'}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-secondary px-4 py-2"
                    onClick={() => navigate('/parent-categories')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMainCategory;