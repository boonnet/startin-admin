import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const SubCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all subcategories on component mount
  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Function to fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/api/sub_category/all`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch subcategories. Please try again later.');
      console.error('Error fetching subcategories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle subcategory deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await axios.delete(`${baseurl}/api/sub_category/delete/${id}`);
        // Refresh the list after deletion
        fetchSubCategories();
        alert('Subcategory deleted successfully');
      } catch (err) {
        alert('Failed to delete subcategory');
        console.error('Error deleting subcategory:', err);
      }
    }
  };

  // Function to handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.sub_category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h5 className="mb-3">Sub Categories</h5>
          <button className="btn mb-3" style={{backgroundColor:'#0133dc', color:'white'}} onClick={() => navigate('/add-sub-category')}>
            Add Sub Category
          </button>
          
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search Categories"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className='table-light text-center'>
                  <tr>
                    <th className='text-center'>#</th>
                    <th className='text-center'>Sub Category name</th>
                    <th className='text-center'>Edit</th>
                    <th className='text-center'>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td className='text-center'>{category.id}</td>
                        <td className='text-center'>{category.sub_category}</td>
                        <td className='text-center'>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => navigate(`/edit-sub-category/${category.id}`)}
                          >
                            <i className="bi-pencil"></i>
                          </button>
                        </td>
                        <td className='text-center'>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleDelete(category.id)}
                          >
                            <i className="bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        {searchTerm ? 'No matching subcategories found' : 'No subcategories available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategories;