import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const AddSubCategory = () => {
  const [formData, setFormData] = useState({
    sub_category: '',
    category_id: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/category/all`);
        
        // Ensure categories is an array before setting state
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          // If data is nested in a 'data' property
          setCategories(response.data.data);
        } else {
          // If response.data is not an array, log it and set an empty array
          console.error('API response is not in expected format:', response.data);
          setCategories([]);
          setError('Invalid data format received from server');
        }
      } catch (err) {
        setError('Failed to fetch categories. Please try again later.');
        console.error('Error fetching categories:', err);
        setCategories([]); // Ensure categories is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.sub_category.trim()) {
      setError('Subcategory name is required');
      return;
    }
    
    if (!formData.category_id) {
      setError('Please select a category');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Submit the form data to the API
      const response = await axios.post(`${baseurl}/api/sub_category/add`, formData);
      
      // Reset form on success
      setFormData({
        sub_category: '',
        category_id: ''
      });
      
      setSuccess('Subcategory added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add subcategory. Please try again.');
      console.error('Error adding subcategory:', err);
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
              <h5 className="card-title mb-4">Add Sub Category</h5>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Sub Category Name */}
                <div className="mb-3">
                  <label htmlFor="sub_category" className="form-label text-dark">
                    Sub Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="sub_category"
                    name="sub_category"
                    value={formData.sub_category}
                    onChange={handleInputChange}
                    placeholder="Name"
                    disabled={loading}
                  />
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                  <label htmlFor="category_id" className="form-label text-dark">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select</option>
                    {Array.isArray(categories) && categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {loading && (
                    <div className="form-text text-muted">Loading categories...</div>
                  )}
                  {!loading && categories.length === 0 && (
                    <div className="form-text text-muted">No categories available</div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn px-4 py-2"
                  style={{ backgroundColor: '#0133dc', color: 'white' }}
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

export default AddSubCategory;