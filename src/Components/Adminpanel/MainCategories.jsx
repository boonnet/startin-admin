import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import baseurl from '../ApiService/ApiService';

const MainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  const navigate = useNavigate();

  // Fetch all categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseurl}/api/category/all`);
      setCategories(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${baseurl}/api/category/delete/${id}`);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      // Refresh the category list
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
    }
  };

  // Handle delete button click
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <h5 className="mb-3">Main Categories</h5>
          <button 
            className="btn mb-3"
            style={{backgroundColor:'#0133dc', color:'white'}} 
            onClick={() => navigate('/add-category')}
          >
            Add Main Category
          </button>
          
          <div className="input-group mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search Categories"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light text-center">
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Category Name</th>
                    <th className="text-center">Created At</th>
                    <th className="text-center">Edit</th>
                    <th className="text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                      <tr key={category.cid}>
                        <td className="text-center">{category.cid}</td>
                        <td className="text-center">{category.category_name}</td>
                        <td className="text-center">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-primary" 
                            onClick={() => navigate(`/edit-main-category/${category.cid}`)}
                          >
                            <i className="bi-pencil"></i>
                          </button>
                        </td>
                        <td className="text-center">
                          <button 
                            className="btn btn-danger"
                            onClick={() => handleDeleteClick(category)}
                          >
                            <i className="bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        {searchTerm ? 'No matching categories found' : 'No categories available'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete the category "{categoryToDelete?.category_name}"?
              This action cannot be undone.
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => deleteCategory(categoryToDelete?.cid)}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default MainCategories;