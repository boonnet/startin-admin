import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const EditSubCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subCategoryName, setSubCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Fetch subcategory data on component mount
  useEffect(() => {
    const fetchSubCategory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/sub_category/${id}`);
        setSubCategoryName(response.data.sub_category);
        setError(null);
      } catch (err) {
        setError('Failed to fetch subcategory details. Please try again.');
        console.error('Error fetching subcategory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subCategoryName.trim()) {
      setSubmitError('Subcategory name is required');
      return;
    }

    try {
      await axios.put(`${baseurl}/api/sub_category/update/${id}`, {
        sub_category: subCategoryName
      });
      
      navigate('/sub-categories');
    } catch (err) {
      setSubmitError('Failed to update subcategory. Please try again.');
      console.error('Error updating subcategory:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/sub-categories')}>
          Back to Subcategories
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Edit Sub Category</h5>
        </div>
        <div className="card-body">
          {submitError && (
            <div className="alert alert-danger" role="alert">
              {submitError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="subCategoryName" className="form-label">Sub Category Name</label>
              <input
                type="text"
                className="form-control"
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn" style={{backgroundColor:'#0133dc', color:'white'}}>Update</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/sub-categories')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSubCategory;