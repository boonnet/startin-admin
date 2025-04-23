import React, { useState, useEffect } from 'react';
import { Trash, Search, ChevronLeft, ChevronRight, FileText, AlertCircle, Eye, Edit, Plus } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import baseurl from '../ApiService/ApiService';

const ViewTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDetailsLoading, setTemplateDetailsLoading] = useState(false);

  const templatesPerPage = 5;

  // Fetch templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/templates/all`);
        setTemplates(response.data.templates);
        setFilteredTemplates(response.data.templates);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredTemplates(templates);
    } else {
      const filtered = templates.filter(template =>
        template.template_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, templates]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle delete template
  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await axios.delete(`${baseurl}/api/templates/delete/${templateId}`);
      setTemplates(templates.filter(template => template.id !== templateId));
      alert("Template deleted successfully");
    } catch (err) {
      console.error('Error deleting template:', err);
      alert('Failed to delete template');
    }
  };

  // Handle view template details
  const handleViewTemplate = async (templateId) => {
    try {
      setTemplateDetailsLoading(true);
      const response = await axios.get(`${baseurl}/api/templates/${templateId}`);
      setSelectedTemplate(response.data.template);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching template details:', err);
      alert('Failed to fetch template details');
    } finally {
      setTemplateDetailsLoading(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  // Pagination logic
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

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

  // Render template details modal
  const renderTemplateDetailsModal = () => {
    if (!selectedTemplate) return null;
    
    // Parse files if stored as string
    const templateFiles = Array.isArray(selectedTemplate.files) 
      ? selectedTemplate.files 
      : (typeof selectedTemplate.files === 'string' ? JSON.parse(selectedTemplate.files) : []);

    return (
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{selectedTemplate.template_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {templateDetailsLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading template details...</span>
              </div>
              <p className="mt-3">Loading template details...</p>
            </div>
          ) : (
            <div>
              {/* Template Overview Section */}
              <h5 className="border-bottom pb-2 mb-4">Template Overview</h5>
              <div className="row mb-4">
                <div className="col-md-8">
                  <Card className="mb-4">
                    <Card.Body>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <h6>Basic Information</h6>
                          <hr />
                          <p><strong>Template ID:</strong> {selectedTemplate.id}</p>
                          <p><strong>Name:</strong> {selectedTemplate.template_name}</p>
                          <p><strong>Price:</strong> ₹{selectedTemplate.price}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>Template Timeline</h6>
                          <hr />
                          <p><strong>Created:</strong> {new Date(selectedTemplate.createdAt).toLocaleString()}</p>
                          <p><strong>Last Updated:</strong> {new Date(selectedTemplate.updatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h6>Description</h6>
                        <hr />
                        <p>{selectedTemplate.description}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-4">
                  <Card className="mb-4">
                    <Card.Body>
                      <h6>Cover Image</h6>
                      <hr />
                      {selectedTemplate.cover_image && (
                        <div className="text-center">
                          <img
                            src={`${baseurl}/${selectedTemplate.cover_image}`}
                            alt="Template Cover"
                            className="img-fluid rounded"
                            style={{ maxHeight: '150px' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                          />
                        </div>
                      )}
                    </Card.Body>
                  </Card>

                  <Card>
                    <Card.Body>
                      <h6>Template Stats</h6>
                      <hr />
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Files:</span>
                        <Badge bg="secondary">{templateFiles.length || 0}</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <FileText size={24} className="text-primary" />
          <h4 className="fw-bold mb-0">Manage Templates</h4>
        </div>
        <p className="text-muted mb-0">View and manage all templates in the system</p>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredTemplates.length}</span>
            <span className="fw-medium">Total Templates</span>
          </div>
          
          <div className="d-flex align-items-center">
            <Link to="/add-template" className="btn btn-primary me-3">
              <Plus size={18} className="me-1" />
              Create New Template
            </Link>
            
            <div className="position-relative">
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search templates..."
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
              <p className="text-muted">Loading template data...</p>
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
                    <th className="px-4" style={{ width: '5%', borderLeft: '3px solid transparent' }}>#</th>
                    <th className="px-4" style={{ width: '20%', borderLeft: '3px solid transparent' }}>Template Name</th>
                    <th className="px-4" style={{ width: '30%', borderLeft: '3px solid transparent' }}>Description</th>
                    <th className="px-4 text-center" style={{ width: '10%', borderLeft: '3px solid transparent' }}>Price</th>
                    <th className="px-4 text-center" style={{ width: '10%', borderLeft: '3px solid transparent' }}>Files</th>
                    <th className="px-4 text-center" style={{ width: '25%', borderLeft: '3px solid transparent' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTemplates.length > 0 ? (
                    currentTemplates.map((template, index) => {
                      const files = Array.isArray(template.files) 
                        ? template.files 
                        : (typeof template.files === 'string' ? JSON.parse(template.files) : []);
                        
                      return (
                        <tr 
                          key={template.id} 
                          style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }}
                          className="template-row"
                        >
                          <td className="px-4 py-3">{indexOfFirstTemplate + index + 1}</td>
                          <td className="px-4 py-3 fw-medium">{template.template_name}</td>
                          <td className="px-4 py-3">
                            {template.description?.length > 50 
                              ? `${template.description.substring(0, 50)}...` 
                              : template.description || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-center">₹{template.price}</td>
                          <td className="px-4 py-3 text-center">{files.length}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              className="btn btn-info btn-sm mx-1"
                              onClick={() => handleViewTemplate(template.id)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="View Template"
                            >
                              <Eye size={16} />
                            </button>
                            <Link 
                              to={`/edit-template/${template.id}`} 
                              className="btn btn-primary btn-sm mx-1"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Edit Template"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              className="btn btn-danger btn-sm mx-1"
                              onClick={() => handleDeleteTemplate(template.id)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Delete Template"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <AlertCircle size={40} className="text-muted mb-3" />
                          <p className="text-muted mb-1">No templates found</p>
                          <small className="text-muted">Try adjusting your search criteria</small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && currentTemplates.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstTemplate + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastTemplate, filteredTemplates.length)}</span> of <span className="fw-bold">{filteredTemplates.length}</span> entries
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

      {/* Render Template Details Modal */}
      {renderTemplateDetailsModal()}

      <style jsx>{`
        .template-row:hover {
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

export default ViewTemplates;