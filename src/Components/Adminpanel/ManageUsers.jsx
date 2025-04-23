import React, { useState, useEffect } from 'react';
import { Trash, Search, ChevronLeft, ChevronRight, Users, AlertCircle, BookOpen, Eye, X } from 'lucide-react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const ManageApprovedUsers = () => {
  const [users, setUsers] = useState([]);
  const [usercourse, setUserCourse] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({ courses: [], templates: [] });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/user/all`);
        if (Array.isArray(response.data)) {
          // Fetch enrollment data for each user
          const usersWithEnrollments = await Promise.all(
            response.data.map(async (user) => {
              const user_id = user.uid;
              try {
                const enrollmentResponse = await axios.get(`${baseurl}/api/enrollment/course/check/${user_id}`, {
                });
                return {
                  ...user,
                  enrolledCourses: Array.isArray(enrollmentResponse.data.data) ? enrollmentResponse.data.data.length : 0
                };
              } catch (err) {
                console.error(`Failed to fetch enrollments for user ${user.uid}:`, err);
                return { ...user, enrolledCourses: 0 };
              }
            })
          );
          setUsers(usersWithEnrollments);
        } else {
          console.error('Invalid response format:', response.data);
          setError('Unexpected data format received');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDisable = async (uid) => {
    if (!uid) {
      console.error('Error: User UID is undefined.');
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`${baseurl}/api/user/delete/${uid}`);
      setUsers((prevUsers) => prevUsers.filter(user => user.uid !== uid));
      alert("User deleted successfully");
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleViewDetails = async (user) => {
    setSelectedUser(user);
    setDetailsLoading(true);
    
    try {
      // Fetch enrolled courses and templates
      const enrollmentResponse = await axios.get(`${baseurl}/api/enrollment/course/check/${user.uid}`);
      const enrollments = enrollmentResponse.data.data || [];
      
      // Filter out courses and templates
      const courseEnrollments = enrollments.filter(item => item.course_id !== null && item.course_id !== undefined);
      const templateEnrollments = enrollments.filter(item => item.template_id !== null && item.template_id !== undefined);
      
      // Fetch course details for each enrolled course
      const coursesWithDetails = await Promise.all(
        courseEnrollments.map(async (enrollment) => {
          try {
            // Fetch course details by course_id
            const courseResponse = await axios.get(`${baseurl}/api/course/${enrollment.course_id}`);
            return {
              ...enrollment,
              courseName: courseResponse.data?.course.course_title || 'Course Name Not Available'
            };
          } catch (err) {
            console.error(`Failed to fetch details for course ${enrollment.course_id}:`, err);
            return {
              ...enrollment,
              courseName: 'Course Name Not Available'
            };
          }
        })
      );
      
      // Fetch template details for each enrolled template
      const templatesWithDetails = await Promise.all(
        templateEnrollments.map(async (enrollment) => {
          try {
            // Fetch template details by template_id
            const templateResponse = await axios.get(`${baseurl}/api/templates/${enrollment.template_id}`);
            return {
              ...enrollment,
              templateName: templateResponse.data?.template.template_name || 'Template Name Not Available'
            };
          } catch (err) {
            console.error(`Failed to fetch details for template ${enrollment.template_id}:`, err);
            return {
              ...enrollment,
              templateName: 'Template Name Not Available'
            };
          }
        })
      );
      
      setUserDetails({
        courses: coursesWithDetails,
        templates: templatesWithDetails
      });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setUserDetails({ courses: [], templates: [] });
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedUser(null);
    setUserDetails({ courses: [], templates: [] });
  };

  // Function to determine badge color based on enrollment count
  const getBadgeColorClass = (enrolledCount) => {
    return enrolledCount > 0 ? 'bg-success' : 'bg-danger';
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
          <Users size={24} className="text-primary" />
          <h4 className="fw-bold mb-0">Manage Users</h4>
        </div>
        <p className="text-muted mb-0">View and manage all registered users in the system</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredUsers.length}</span>
            <span className="fw-medium">Total Users</span>
          </div>
          
          <div className="position-relative">
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: '300px', paddingLeft: '40px' }}
            />
            <Search size={18} className="position-absolute text-muted" style={{ left: '12px', top: '10px' }} />
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
              <div className="spinner-grow text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading user data...</p>
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
                    <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>#</th>
                    <th className="px-4" style={{  borderLeft: '3px solid transparent' }}>Username</th>
                    <th className="px-4" style={{  borderLeft: '3px solid transparent' }}>Email</th>
                    <th className="px-4 text-center" style={{ borderLeft: '3px solid transparent' }}>
                      <div className="d-flex align-items-center justify-content-center">
                        <span>Enrolled Courses & Templates</span>
                      </div>
                    </th>
                    <th className="px-4 text-center" style={{ width: '20%', borderLeft: '3px solid transparent' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr key={user.uid} style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }} 
                          className="user-row" // For custom hover effect
                      >
                        <td className="px-4 py-3">{indexOfFirstUser + index + 1}</td>
                        <td className="px-4 py-3 fw-medium">{user.username || 'N/A'}</td>
                        <td className="px-4 py-3">{user.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`badge ${getBadgeColorClass(user.enrolledCourses)} rounded-pill px-3 py-2`}>
                            {user.enrolledCourses || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-info btn-sm"
                              onClick={() => handleViewDetails(user)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="View User Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDisable(user.uid)}
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Delete User"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <AlertCircle size={40} className="text-muted mb-3" />
                          <p className="text-muted mb-1">No users found</p>
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

        {!loading && !error && currentUsers.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstUser + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="fw-bold">{filteredUsers.length}</span> entries
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="bg-white rounded-3 shadow-lg" style={{ width: '90%', maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0">{selectedUser.username}'s Details</h5>
                <p className="text-muted mb-0 small">{selectedUser.email}</p>
              </div>
              <button className="btn btn-sm btn-light rounded-circle" onClick={closeDetails}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {detailsLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                          <BookOpen size={18} className="text-primary me-2" />
                          <h6 className="fw-bold mb-0">Enrolled Courses</h6>
                          <span className="badge bg-primary rounded-pill ms-2">{userDetails.courses.length}</span>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        {userDetails.courses.length > 0 ? (
                          <ul className="list-group list-group-flush">
                            {userDetails.courses.map((course, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-0 fw-medium">{course.courseName || course.course_name || 'Course Name Not Available'}</p>
                                  <small className="text-muted">Course ID: {course.course_id || 'N/A'}</small>
                                </div>
                                <span className="badge bg-success rounded-pill">Enrolled</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle size={30} className="text-muted mb-2" />
                            <p className="text-muted mb-0">No courses enrolled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <div className="d-flex align-items-center">
                          <BookOpen size={18} className="text-primary me-2" />
                          <h6 className="fw-bold mb-0">Enrolled Templates</h6>
                          <span className="badge bg-primary rounded-pill ms-2">{userDetails.templates.length}</span>
                        </div>
                      </div>
                      <div className="card-body p-0">
                        {userDetails.templates.length > 0 ? (
                          <ul className="list-group list-group-flush">
                            {userDetails.templates.map((template, index) => (
                              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="mb-0 fw-medium">{template.templateName || template.template_name || 'Template Name Not Available'}</p>
                                  <small className="text-muted">Template ID: {template.template_id || 'N/A'}</small>
                                </div>
                                <span className="badge bg-success rounded-pill">Enrolled</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4">
                            <AlertCircle size={30} className="text-muted mb-2" />
                            <p className="text-muted mb-0">No templates enrolled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-light border-top d-flex justify-content-end">
              <button className="btn btn-secondary" onClick={closeDetails}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .user-row:hover {
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

export default ManageApprovedUsers;