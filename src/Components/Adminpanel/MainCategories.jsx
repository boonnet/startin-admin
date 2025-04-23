import React, { useState, useEffect } from 'react';
import { Trash, Search, ChevronLeft, ChevronRight, Folder, AlertCircle, Edit } from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;
  
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  // Function to render page numbers with ellipsis for large number of pages
  const renderPageNumbers = () => {
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button 
          key={number} 
          className={`btn ${currentPage === number ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ));
    } else {
      let pages = [];
      
      // Always show first page
      pages.push(
        <button 
          key={1} 
          className={`btn ${currentPage === 1 ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      
      // Calculate range of page numbers to show around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push(
          <button key="ellipsis1" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button 
            key={i} 
            className={`btn ${currentPage === i ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pages.push(
          <button key="ellipsis2" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(
          <button 
            key={totalPages} 
            className={`btn ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
      
      return pages;
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Folder size={24} className="text-primary" />
          <h4 className="fw-bold mb-0">Manage Categories</h4>
        </div>
        <p className="text-muted mb-0">View and manage all categories in the system</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredCategories.length}</span>
            <span className="fw-medium">Total Categories</span>
          </div>
          
          <div className="d-flex gap-3">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/add-category')}
            >
              Add Main Category
            </button>
            
            <div className="position-relative">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ width: '300px', paddingLeft: '40px' }}
              />
              <Search size={18} className="position-absolute text-muted" style={{ left: '12px', top: '10px' }} />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-grow text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading category data...</p>
            </div>
          ) : error ? (
            <div className="d-flex align-items-center justify-content-center text-danger py-5">
              <AlertCircle size={20} className="me-2" />
              <p className="mb-0">{error}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0 table-striped">
                <thead>
                  <tr className="text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                    <th className="px-4" style={{ width: '6%', borderLeft: '3px solid transparent' }}>#</th>
                    <th className="px-4" style={{ width: '32%', borderLeft: '3px solid transparent' }}>Category Name</th>
                    <th className="px-4" style={{ width: '32%', borderLeft: '3px solid transparent' }}>Created At</th>
                    <th className="px-4 text-center" style={{ width: '30%', borderLeft: '3px solid transparent' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.length > 0 ? (
                    currentCategories.map((category, index) => (
                      <tr key={category.cid} style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }} 
                          className="category-row"
                      >
                        <td className="px-4 py-3">{indexOfFirstCategory + index + 1}</td>
                        <td className="px-4 py-3 fw-medium">{category.category_name}</td>
                        <td className="px-4 py-3">{new Date(category.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => navigate(`/edit-main-category/${category.cid}`)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Edit Category"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteClick(category)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Delete Category"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <AlertCircle size={40} className="text-muted mb-3" />
                          <p className="text-muted mb-1">No categories found</p>
                          <small className="text-muted">
                            {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first category'}
                          </small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && currentCategories.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstCategory + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastCategory, filteredCategories.length)}</span> of <span className="fw-bold">{filteredCategories.length}</span> entries
                </small>
              </div>
              
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="d-flex">
                  {renderPageNumbers()}
                </div>
                
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
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

      <style jsx>{`
        .category-row:hover {
          background-color: #f8f9ff !important;
          border-left: 3px solid #0d6efd !important;
          cursor: pointer;
        }
        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>
    </div>
  );
};

export default MainCategories;