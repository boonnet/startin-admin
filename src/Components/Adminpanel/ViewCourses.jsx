import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

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

  // Render course details modal - Modified to show all lessons in a scrollable view
  const renderCourseDetailsModal = () => {
    if (!selectedCourse) return null;

    // Sort lessons by order if available
    const sortedLessons = selectedCourse.Lessions
      ? [...selectedCourse.Lessions].sort((a, b) => a.lession_order - b.lession_order)
      : [];

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

              {/* Course Lessons Section - Modified to show all lessons without accordion */}
              <h5 className="border-bottom pb-2 mb-4">Course Lessons</h5>
              <Card className="mb-4">
                <Card.Body>
                  {sortedLessons.length > 0 ? (
                    <div className="lessons-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {sortedLessons.map((lesson, index) => (
                        <Card key={lesson.id} className="mb-3 lesson-card">
                          <Card.Header className="bg-light">
                            <div className="d-flex align-items-center w-100">
                              <Badge bg={lesson.content_type === 'Video' ? 'primary' : 'success'} className="me-2">
                                {lesson.content_type}
                              </Badge>
                              <span className="me-2">{index + 1}.</span>
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

  if (loading) return <div className="text-center mt-5">Loading courses...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h4>Manage Approved Courses</h4>

      <div className="mb-4 d-flex justify-content-end">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Courses"
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
              <th className="text-center">Course Title</th>
              <th className="text-center">Category</th>
              <th className="text-center">Subcategory</th>
              <th className="text-center">Level</th>
              <th className="text-center">Duration</th>
              <th className="text-center">View</th>
              <th className="text-center">Edit</th>
              <th className="text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.length > 0 ? (
              currentCourses.map((course, index) => (
                <tr key={course.id}>
                  <td className="text-center">{indexOfFirstCourse + index + 1}</td>
                  <td className="text-center">{course.course_title}</td>
                  <td className="text-center">{course.parent_category}</td>
                  <td className="text-center">{course.sub_category}</td>
                  <td className="text-center">{course.course_level}</td>
                  <td className="text-center">{course.time_spend}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-info"
                      onClick={() => handleViewCourse(course.id)}
                    >
                      <i className="bi-eye"></i>
                    </button>
                  </td>
                  <td className="text-center">
                    <Link to={`/edit-course/${course.id}`} className="btn btn-primary">
                      <i className="bi-pencil"></i>
                    </Link>
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <i className="bi-x"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No courses found</td>
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

      {/* Render Course Details Modal */}
      {renderCourseDetailsModal()}
    </div>
  );
};

export default ViewCourses;