import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

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
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch templates');
        setLoading(false);
        console.error('Error fetching templates:', err);
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

  // Pagination logic
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstTemplate, indexOfLastTemplate);
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  // Handle delete template
  const handleDeleteTemplate = async (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await axios.delete(`${baseurl}/api/templates/delete/${templateId}`);
        setTemplates(templates.filter(template => template.id !== templateId));
      } catch (err) {
        console.error('Error deleting template:', err);
        alert('Failed to delete template');
      }
    }
  };

  // Handle view template details
  const handleViewTemplate = async (templateId) => {
    try {
      setTemplateDetailsLoading(true);
      const response = await axios.get(`${baseurl}/api/templates/${templateId}`);
      setSelectedTemplate(response.data.template);
      setShowModal(true);
      setTemplateDetailsLoading(false);
    } catch (err) {
      console.error('Error fetching template details:', err);
      alert('Failed to fetch template details');
      setTemplateDetailsLoading(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <li className={`page-item ${currentPage === i ? 'active' : ''}`} key={i}>
          <button
            className={`page-link border-primary ${currentPage === i ? 'bg-primary text-white' : ''}`}
            style={{ color: currentPage === i ? 'white' : '#0d6efd' }}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return items;
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

  if (loading) return <div className="text-center mt-5">Loading templates...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h4>Manage Templates</h4>

      <div className="mb-4 d-flex justify-content-between">
        <Link to="/add-template" className="btn" style={{backgroundColor:'#0133dc', color:'white'}}>
          <i className="bi-plus-circle me-1"></i>
          Create New Template
        </Link>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Templates"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ boxShadow: 'none' }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Template Name</th>
              <th className="text-center">Description</th>
              <th className="text-center">Price</th>
              <th className="text-center">Files</th>
              <th className="text-center">View</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentTemplates.length > 0 ? (
              currentTemplates.map((template, index) => {
                const files = Array.isArray(template.files) 
                  ? template.files 
                  : (typeof template.files === 'string' ? JSON.parse(template.files) : []);
                  
                return (
                  <tr key={template.id}>
                    <td className="text-center">{indexOfFirstTemplate + index + 1}</td>
                    <td>{template.template_name}</td>
                    <td>{template.description?.length > 50 
                      ? `${template.description.substring(0, 50)}...` 
                      : template.description}
                    </td>
                    <td className="text-center">₹{template.price}</td>
                    <td className="text-center">{files.length}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-info"
                        onClick={() => handleViewTemplate(template.id)}
                      >
                        <i className="bi-eye"></i>
                      </button>
                    </td>
                    <td className="text-center">
                      <Link to={`/edit-template/${template.id}`} className="btn btn-primary">
                        <i className="bi-pencil"></i>
                      </Link>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <i className="bi-x"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-center">No templates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination m-0">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link border-primary "
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                style={{ color: '#0d6efd' }}
                disabled={currentPage === 1}
              >
                &laquo;
              </button>
            </li>

            {renderPaginationItems()}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link border-primary"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                style={{ color: '#0d6efd' }}
                disabled={currentPage === totalPages}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Render Template Details Modal */}
      {renderTemplateDetailsModal()}
    </div>
  );
};

export default ViewTemplates;