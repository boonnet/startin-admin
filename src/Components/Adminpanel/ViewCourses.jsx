import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

const ViewCourses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailsLoading, setCourseDetailsLoading] = useState(false);
  
  // Lessons pagination state
  const [lessonsCurrentPage, setLessonsCurrentPage] = useState(1);
  const lessonsPerPage = 3; // Number of lessons per page in the modal

  const coursesPerPage = 5;

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/course/all`);
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
        console.error('Error fetching courses:', err);
      }
    };

    fetchCourses();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, courses]);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${baseurl}/api/course/${courseId}`);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        alert('Failed to delete course');
      }
    }
  };

  // Handle view course details
  const handleViewCourse = async (courseId) => {
    try {
      setCourseDetailsLoading(true);
      const response = await axios.get(`${baseurl}/api/course/${courseId}`);
      setSelectedCourse(response.data.course);
      setShowModal(true);
      setCourseDetailsLoading(false);
      setLessonsCurrentPage(1); // Reset lessons pagination when viewing a new course
    } catch (err) {
      console.error('Error fetching course details:', err);
      alert('Failed to fetch course details');
      setCourseDetailsLoading(false);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  // Function to render page numbers with ellipsis for large number of pages
  const renderPaginationItems = () => {
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
        <button 
          key={number} 
          className={`btn ${currentPage === number ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => setCurrentPage(number)}
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
          onClick={() => setCurrentPage(1)}
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
            onClick={() => setCurrentPage(i)}
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
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        );
      }
      
      return pages;
    }
  };

  // Generate pagination items for lessons
  const renderLessonsPaginationItems = (totalLessonsPages) => {
    const maxPageButtons = 5;
    
    if (totalLessonsPages <= maxPageButtons) {
      return Array.from({ length: totalLessonsPages }, (_, i) => i + 1).map(number => (
        <button 
          key={`lesson-page-${number}`} 
          className={`btn ${lessonsCurrentPage === number ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => setLessonsCurrentPage(number)}
        >
          {number}
        </button>
      ));
    } else {
      let pages = [];
      
      // Always show first page
      pages.push(
        <button 
          key="lesson-page-1" 
          className={`btn ${lessonsCurrentPage === 1 ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => setLessonsCurrentPage(1)}
        >
          1
        </button>
      );
      
      // Calculate range of page numbers to show around current page
      let startPage = Math.max(2, lessonsCurrentPage - 1);
      let endPage = Math.min(totalLessonsPages - 1, lessonsCurrentPage + 1);
      
      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pages.push(
          <button key="lesson-ellipsis1" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button 
            key={`lesson-page-${i}`} 
            className={`btn ${lessonsCurrentPage === i ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => setLessonsCurrentPage(i)}
          >
            {i}
          </button>
        );
      }
      
      // Add ellipsis if needed after middle pages
      if (endPage < totalLessonsPages - 1) {
        pages.push(
          <button key="lesson-ellipsis2" className="btn btn-light mx-1 disabled">...</button>
        );
      }
      
      // Always show last page
      if (totalLessonsPages > 1) {
        pages.push(
          <button 
            key={`lesson-page-${totalLessonsPages}`} 
            className={`btn ${lessonsCurrentPage === totalLessonsPages ? 'btn-primary' : 'btn-light'} mx-1`}
            onClick={() => setLessonsCurrentPage(totalLessonsPages)}
          >
            {totalLessonsPages}
          </button>
        );
      }
      
      return pages;
    }
  };

  // Render course details modal with paginated lessons
  const renderCourseDetailsModal = () => {
    if (!selectedCourse) return null;

    // Sort lessons by order if available
    const sortedLessons = selectedCourse.Lessions
      ? [...selectedCourse.Lessions].sort((a, b) => a.lession_order - b.lession_order)
      : [];
    
    // Lessons pagination logic
    const totalLessonsPages = Math.ceil(sortedLessons.length / lessonsPerPage);
    const indexOfLastLesson = lessonsCurrentPage * lessonsPerPage;
    const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
    const currentLessons = sortedLessons.slice(indexOfFirstLesson, indexOfLastLesson);

    return (
      <Modal show={showModal} onHide={handleCloseModal} size="xl" dialogClassName="modal-90w">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{selectedCourse.course_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {courseDetailsLoading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading course details...</span>
              </div>
              <p className="mt-3">Loading course details...</p>
            </div>
          ) : (
            <div>
              {/* Course Overview Section */}
              <h5 className="border-bottom pb-2 mb-4">Course Overview</h5>
              <div className="row mb-4">
                <div className="col-md-8">
                  <Card className="mb-4">
                    <Card.Body>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <h6>Basic Information</h6>
                          <hr />
                          <p><strong>Course ID:</strong> {selectedCourse.id}</p>
                          <p><strong>Title:</strong> {selectedCourse.course_title}</p>
                          <p><strong>Category:</strong> {selectedCourse.parent_category}</p>
                          <p><strong>Subcategory:</strong> {selectedCourse.sub_category}</p>
                          <p><strong>Level:</strong> <Badge bg="info">{selectedCourse.course_level}</Badge></p>
                          <p><strong>Duration:</strong> {selectedCourse.time_spend}</p>
                        </div>
                        <div className="col-md-6">
                          <h6>Course Timeline</h6>
                          <hr />
                          <p><strong>Created:</strong> {new Date(selectedCourse.createdAt).toLocaleString()}</p>
                          <p><strong>Last Updated:</strong> {new Date(selectedCourse.updatedAt).toLocaleString()}</p>
                          <p>
                            <strong>Subscription:</strong>{' '}
                            {selectedCourse.subscription_id
                              ? <Badge bg="success">Required (ID: {selectedCourse.subscription_id})</Badge>
                              : <Badge bg="secondary">Not Required</Badge>
                            }
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h6>Description</h6>
                        <hr />
                        <p>{selectedCourse.course_description}</p>
                      </div>
                      <div className="mb-4">
                        <h6>Requirements</h6>
                        <hr />
                        <p>{selectedCourse.course_requirements || 'No specific requirements'}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                <div className="col-md-4">
                  <Card className="mb-4">
                    <Card.Body>
                      <h6>Media Files</h6>
                      <hr />
                      {selectedCourse.course_image && (
                        <div className="mb-3">
                          <p><strong>Course Image:</strong></p>
                          <div className="text-center">
                            <img
                              src={`${baseurl}/${selectedCourse.course_image}`}
                              alt="Course Thumbnail"
                              className="img-fluid rounded"
                              style={{ maxHeight: '150px' }}
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                            />
                          </div>
                        </div>
                      )}

                      {selectedCourse.preview_video && (
                        <div className="mb-3">
                          <p><strong>Preview Video:</strong></p>
                          <div className="text-center">
                            <video
                              width="100%"
                              height="auto"
                              controls
                              onContextMenu={(e) => e.preventDefault()} // Disables right-click menu
                              controlsList="nodownload" // Prevents download option in some browsers
                            >
                              <source src={`${baseurl}/${selectedCourse.preview_video}`} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </div>
                      )}

                    </Card.Body>
                  </Card>

                  <Card>
                    <Card.Body>
                      <h6>Course Stats</h6>
                      <hr />
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Lessons:</span>
                        <Badge bg="secondary">{selectedCourse.Lessions?.length || 0}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Video Lessons:</span>
                        <Badge bg="primary">
                          {selectedCourse.Lessions?.filter(lesson => lesson.content_type === 'Video').length || 0}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Quiz Lessons:</span>
                        <Badge bg="success">
                          {selectedCourse.Lessions?.filter(lesson => lesson.content_type === 'Quiz').length || 0}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Course Lessons Section with Pagination */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Course Lessons</h5>
              </div>

              <Card className="mb-4">
                <Card.Body>
                  {sortedLessons.length > 0 ? (
                    <>
                      <div className="lessons-container">
                        {currentLessons.map((lesson, index) => (
                          <Card key={lesson.id} className="mb-3 lesson-card">
                            <Card.Header className="bg-light">
                              <div className="d-flex align-items-center w-100">
                                <Badge bg={lesson.content_type === 'Video' ? 'primary' : 'success'} className="me-2">
                                  {lesson.content_type}
                                </Badge>
                                <span className="me-2">{indexOfFirstLesson + index + 1}.</span>
                                <strong>{lesson.lession_title}</strong>
                                {lesson.content_type === 'Video' && lesson.duration && (
                                  <Badge bg="light" text="dark" className="ms-auto">
                                    <i className="bi-clock me-1"></i> {lesson.duration} min
                                  </Badge>
                                )}
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <div className="row">
                                <div className="col-md-8">
                                  <p><strong>Description:</strong> {lesson.description || 'No description available'}</p>
                                  <p><strong>Order:</strong> {lesson.lession_order}</p>

                                  {lesson.content_type === 'Video' && (
                                    <>
                                      <p><strong>Duration:</strong> {lesson.duration} minutes</p>
                                      {lesson.document_url && (
                                        <p>
                                          <strong>Document URL:</strong>{' '}
                                          <a href={lesson.document_url} target="_blank" rel="noopener noreferrer">
                                            {lesson.document_url}
                                          </a>
                                        </p>
                                      )}
                                    </>
                                  )}

                                  {lesson.content_type === 'Quiz' && lesson.Quiz && (
                                    <div className="mt-3">
                                      <h6>Quiz Questions</h6>
                                      <div className="list-group mt-2">
                                        {lesson.Quiz.Questions && lesson.Quiz.Questions.map((question, qIndex) => (
                                          <div className="list-group-item list-group-item-action" key={question.id || qIndex}>
                                            <div className="d-flex w-100 justify-content-between">
                                              <h6 className="mb-2">Question {qIndex + 1}</h6>
                                            </div>
                                            <p><strong>Question:</strong> {question.question}</p>
                                            <div className="mt-2">
                                              <p><strong>Options:</strong></p>
                                              <ol type="a">
                                                <li className={question.correct_answer === question.option_1 ? 'text-success fw-bold' : ''}>
                                                  {question.option_1}
                                                  {question.correct_answer === question.option_1 && ' (Correct)'}
                                                </li>
                                                <li className={question.correct_answer === question.option_2 ? 'text-success fw-bold' : ''}>
                                                  {question.option_2}
                                                  {question.correct_answer === question.option_2 && ' (Correct)'}
                                                </li>
                                                <li className={question.correct_answer === question.option_3 ? 'text-success fw-bold' : ''}>
                                                  {question.option_3}
                                                  {question.correct_answer === question.option_3 && ' (Correct)'}
                                                </li>
                                                <li className={question.correct_answer === question.option_4 ? 'text-success fw-bold' : ''}>
                                                  {question.option_4}
                                                  {question.correct_answer === question.option_4 && ' (Correct)'}
                                                </li>
                                              </ol>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="col-md-4">
                                  {lesson.content_type === 'Video' && (
                                    <div className="media-section text-center">
                                      {lesson.lession_image && (
                                        <div className="mb-3">
                                          <img
                                            src={`${baseurl}/${lesson.lession_image}`}
                                            alt={`Lesson ${index + 1} thumbnail`}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '120px' }}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/120'; }}
                                          />
                                        </div>
                                      )}

                                      {lesson.lession_video && (
                                        <div className="mt-2">
                                          <video
                                            width="100%"
                                            height="auto"
                                            controls
                                            onContextMenu={(e) => e.preventDefault()} // Disables right-click menu
                                            controlsList="nodownload" // Prevents the download button
                                          >
                                            <source src={`${baseurl}/${lesson.lession_video}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                          </video>
                                        </div>
                                      )}

                                    </div>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>

                      {/* Lessons Pagination */}
                      {totalLessonsPages > 1 && (
                        <div className="card-footer bg-white py-3 mt-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small className="text-muted">
                                Showing <span className="fw-bold text-primary">{indexOfFirstLesson + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastLesson, sortedLessons.length)}</span> of <span className="fw-bold">{sortedLessons.length}</span> lessons
                              </small>
                            </div>
                            
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-outline-primary me-2"
                                onClick={() => setLessonsCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={lessonsCurrentPage === 1}
                              >
                                <ChevronLeft size={18} />
                              </button>
                              
                              <div className="d-flex">
                                {renderLessonsPaginationItems(totalLessonsPages)}
                              </div>
                              
                              <button
                                className="btn btn-outline-primary ms-2"
                                onClick={() => setLessonsCurrentPage(prev => Math.min(prev + 1, totalLessonsPages))}
                                disabled={lessonsCurrentPage === totalLessonsPages}
                              >
                                <ChevronRight size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="alert alert-info">
                      This course has no lessons yet.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="spinner-grow text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading course data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center text-danger py-5">
        <AlertCircle size={20} className="me-2" />
        <p className="mb-0">{error}</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="bg-light p-4 rounded-3 shadow-sm mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <h4 className="fw-bold mb-0">Manage Courses</h4>
        </div>
        <p className="text-muted mb-0">View and manage all courses in the system</p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <span className="badge bg-primary rounded-pill me-2">{filteredCourses.length}</span>
            <span className="fw-medium">Total Courses</span>
          </div>
          
          <div className="position-relative">
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px', paddingLeft: '40px' }}
            />
            <Search size={18} className="position-absolute text-muted" style={{ left: '12px', top: '10px' }} />
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table mb-0 table-striped">
              <thead>
                <tr className="text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                  <th className="px-4" style={{borderLeft: '3px solid transparent' }}>#</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Course Title</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Category</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Subcategory</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Level</th>
                  <th className="px-4" style={{ borderLeft: '3px solid transparent' }}>Duration</th>
                  <th className="px-4 text-center" style={{ width: '20%', borderLeft: '3px solid transparent' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.length > 0 ? (
                  currentCourses.map((course, index) => (
                    <tr key={course.id} style={{ borderLeft: '3px solid transparent', transition: 'all 0.2s' }} 
                        className="course-row" // For custom hover effect
                    >
                      <td className="px-4 py-3">{indexOfFirstCourse + index + 1}</td>
                      <td className="px-4 py-3 fw-medium">{course.course_title}</td>
                      <td className="px-4 py-3">{course.parent_category}</td>
                      <td className="px-4 py-3">{course.sub_category}</td>
                      <td className="px-4 py-3">{course.course_level}</td>
                      <td className="px-4 py-3">{course.time_spend}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleViewCourse(course.id)}
                        >
                          <i className="bi-eye"></i>
                        </button>
                        <Link to={`/edit-course/${course.id}`} className="btn btn-primary btn-sm me-2">
                          <i className="bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          <i className="bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center">
                        <AlertCircle size={40} className="text-muted mb-3" />
                        <p className="text-muted mb-1">No courses found</p>
                        <small className="text-muted">Try adjusting your search criteria</small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!loading && !error && currentCourses.length > 0 && (
          <div className="card-footer bg-white py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">
                  Showing <span className="fw-bold text-primary">{indexOfFirstCourse + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastCourse, filteredCourses.length)}</span> of <span className="fw-bold">{filteredCourses.length}</span> entries
                </small>
              </div>
              
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="d-flex">
                  {renderPaginationItems()}
                </div>
                
                <button
                  className="btn btn-outline-primary ms-2"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Render Course Details Modal */}
      {renderCourseDetailsModal()}

      <style jsx>{`
        .course-row:hover {
          background-color: #f8f9ff !important;
          border-left: 3px solid #0d6efd !important;
          cursor: pointer;
        }
        .table-striped > tbody > tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.02);
        }
      `}</style>

      {/* Render Course Details Modal */}
      {renderCourseDetailsModal()}
    </div>
  );
};

export default ViewCourses;