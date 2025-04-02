import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // File input refs to clear them after submission
  const courseImageRef = useRef(null);
  const courseVideoRef = useRef(null);
  const certificateTemplateRef = useRef(null);

  const [formData, setFormData] = useState({
    courseTitle: '',
    parentCategory: '',
    subCategory: '',
    courseDescription: '',
    timeSpend: '',
    requirements: '',
    level: '',
    validityDays: '',
    coursePrice: '',
    courseImage: null,
    courseVideo: null,
    certificateTemplate: null
  });

  const [originalImages, setOriginalImages] = useState({
    courseImage: '',
    courseVideo: '',
    certificateTemplate: ''
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const emptyVideoLesson = {
    type: 'Video',
    title: '',
    description: '',
    duration: '',
    order: '',
    image: null,
    originalImage: '',
    video: null,
    originalVideo: '',
    document: ''
  };

  const emptyQuiz = {
    type: 'Quiz',
    title: '',
    description: '',
    order: '',
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correct_answer: ''
    }]
  };

  // Fetch course data to populate the form
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setPageLoading(true);
        const response = await axios.get(`${baseurl}/api/course/${id}`);
        const courseData = response.data.course;
        
        // Set form data
        setFormData({
          courseTitle: courseData.course_title || '',
          parentCategory: courseData.parent_category || '',
          subCategory: courseData.sub_category || '',
          courseDescription: courseData.course_description || '',
          timeSpend: courseData.time_spend || '',
          requirements: courseData.course_requirements || '',
          level: courseData.course_level || '',
          validityDays: courseData.validity_days || '',
          coursePrice: courseData.course_price || '',
          courseImage: null,
          courseVideo: null,
          certificateTemplate: null
        });
        
        setOriginalImages({
          courseImage: courseData.course_image || '',
          courseVideo: courseData.preview_video || '',
          certificateTemplate: courseData.certificate_template || ''
        });
        
        // Transform lessons data to match form structure
        if (courseData.Lessions && courseData.Lessions.length > 0) {
          const transformedLessons = courseData.Lessions.map(lesson => {
            if (lesson.content_type === 'Video') {
              return {
                id: lesson.id,
                type: 'Video',
                title: lesson.lession_title || '',
                description: lesson.description || '',
                duration: lesson.duration || '',
                order: lesson.lession_order || '',
                originalImage: lesson.lession_image || '',
                originalVideo: lesson.lession_video || '',
                document: lesson.document_url || ''
              };
            } else {
              // Quiz lesson
              // First, check if Quiz exists and Questions exist
              let quizQuestions = [];
              
              if (lesson.Quiz && lesson.Quiz.Questions && lesson.Quiz.Questions.length > 0) {
                quizQuestions = lesson.Quiz.Questions.map(q => ({
                  id: q.id,
                  question: q.question || '',
                  options: [
                    q.option_1 || '',
                    q.option_2 || '',
                    q.option_3 || '',
                    q.option_4 || ''
                  ],
                  correct_answer: q.correct_answer || ''
                }));
              } else {
                // If no questions found, set default empty question
                quizQuestions = [{
                  question: '',
                  options: ['', '', '', ''],
                  correct_answer: ''
                }];
              }
              
              return {
                id: lesson.id,
                type: 'Quiz',
                title: lesson.lession_title || '',
                description: lesson.description || '',
                order: lesson.lession_order || '',
                quizId: lesson.Quiz?.id, // Store the quiz ID if available
                questions: quizQuestions
              };
            }
          });
          
          setLessons(transformedLessons);
        }
        
        setPageLoading(false);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data. Please try again.');
        setPageLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/category/all`);
        if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          console.error('Expected an array but got:', response.data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/sub_category/all`);
        if (response.data && Array.isArray(response.data)) {
          setSubCategories(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sub categories:', error);
      }
    };

    fetchSubCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const courseFormData = new FormData();
      
      // Create the course data object that matches the backend structure
      const courseData = {
        course_title: formData.courseTitle,
        parent_category: formData.parentCategory,
        sub_category: formData.subCategory,
        course_description: formData.courseDescription,
        time_spend: formData.timeSpend,
        course_requirements: formData.requirements,
        course_level: formData.level,
        validity_days: formData.validityDays,
        course_price: formData.coursePrice,
      };
      
      // Convert the courseData to JSON and add it to FormData
      courseFormData.append('data', JSON.stringify(courseData));
      
      // Add file uploads if new files were selected
      if (formData.courseImage && typeof formData.courseImage === 'object') {
        courseFormData.append('course_image', formData.courseImage);
      }
      
      if (formData.courseVideo && typeof formData.courseVideo === 'object') {
        courseFormData.append('preview_video', formData.courseVideo);
      }
      
      if (formData.certificateTemplate && typeof formData.certificateTemplate === 'object') {
        courseFormData.append('certificate_template', formData.certificateTemplate);
      }
      
      // Process lessons array to match backend structure
      const processedLessons = lessons.map((lesson, index) => {
        if (lesson.type === 'Video') {
          return {
            id: lesson.id, // Include the lesson ID for existing lessons
            lession_title: lesson.title,
            content_type: 'Video',
            lession_order: lesson.order || index + 1,
            description: lesson.description,
            duration: lesson.duration,
            document_url: lesson.document
          };
        } else {
          // Process quiz
          return {
            id: lesson.id, // Include the lesson ID for existing lessons
            lession_title: lesson.title,
            content_type: 'Quiz',
            lession_order: lesson.order || index + 1,
            description: lesson.description,
            quiz: {
              id: lesson.quizId, // Include quiz ID if it exists
              quiz_title: lesson.title,
              questions: lesson.questions.map(q => ({
                id: q.id, // Include the question ID for existing questions
                question: q.question,
                option_1: q.options[0],
                option_2: q.options[1],
                option_3: q.options[2],
                option_4: q.options[3],
                correct_answer: q.correct_answer
              }))
            }
          };
        }
      });
      
      // Add lessons array to the courseData
      courseData.lessons = processedLessons;
      
      // Update the data field with the complete courseData object
      courseFormData.set('data', JSON.stringify(courseData));
      
      // Add lesson files
      lessons.forEach((lesson, index) => {
        if (lesson.type === 'Video') {
          if (lesson.image && typeof lesson.image === 'object') {
            courseFormData.append(`lesson_images`, lesson.image);
            courseFormData.append('lesson_image_index', index); // To match image with lesson
          }
          if (lesson.video && typeof lesson.video === 'object') {
            courseFormData.append(`lesson_videos`, lesson.video);
            courseFormData.append('lesson_video_index', index); // To match video with lesson
          }
        }
      });

      // Send update request
      const response = await axios.put(`${baseurl}/api/course/${id}`, courseFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Course updated successfully!');
      navigate('/approved-courses'); // Navigate back to course list
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the course');
      console.error('Error updating course:', err);
      alert(`Failed to update course: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleLessonChange = (index, field, value) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      updatedLessons[index] = {
        ...updatedLessons[index],
        [field]: value
      };
      return updatedLessons;
    });
  };

  const handleQuestionChange = (lessonIndex, questionIndex, field, value, optionIndex = null) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      const lesson = { ...updatedLessons[lessonIndex] };
      const question = { ...lesson.questions[questionIndex] };

      if (field === 'options' && optionIndex !== null) {
        question.options = [...question.options];
        question.options[optionIndex] = value;
      } else {
        question[field] = value;
      }

      lesson.questions[questionIndex] = question;
      updatedLessons[lessonIndex] = lesson;
      return updatedLessons;
    });
  };

  const handleAddLesson = (type) => {
    setLessons(prevLessons => [
      ...prevLessons,
      type === 'Video' ? emptyVideoLesson : emptyQuiz
    ]);
  };

  const handleRemoveLesson = (indexToRemove) => {
    setLessons(prevLessons => 
      prevLessons.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleAddQuestion = (lessonIndex) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      updatedLessons[lessonIndex].questions.push({
        question: '',
        options: ['', '', '', ''],
        correct_answer: ''
      });
      return updatedLessons;
    });
  };

  const handleRemoveQuestion = (lessonIndex, questionIndex) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      const lesson = { ...updatedLessons[lessonIndex] };
      lesson.questions = lesson.questions.filter((_, index) => index !== questionIndex);
      updatedLessons[lessonIndex] = lesson;
      return updatedLessons;
    });
  };

  const handleLessonFileChange = (index, field, file) => {
    setLessons(prevLessons => {
      const updatedLessons = [...prevLessons];
      updatedLessons[index] = {
        ...updatedLessons[index],
        [field]: file
      };
      return updatedLessons;
    });
  };

  if (pageLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <form onSubmit={handleSubmit}>
        <h2>Edit Course</h2>
        <div className="mb-3">
          <label className="form-label">Course Title</label>
          <input 
            type="text" 
            className="form-control"
            name="courseTitle"
            placeholder="Course Name"
            value={formData.courseTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Course Description</label>
          <textarea 
            className="form-control"
            name="courseDescription"
            rows="6"
            value={formData.courseDescription}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Parent Category</label>
          <select 
            className="form-select"
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((category) => (
              <option key={category.cid} value={category.category_name}>{category.category_name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Sub Category</label>
          <select 
            className="form-select"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Sub Category</option>
            {subCategories.map((sub_category) => (
              <option key={sub_category.id} value={sub_category.sub_category}>{sub_category.sub_category}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Course Cover Image (.jpg, .png, .jpeg)</label>
          {originalImages.courseImage && (
            <div className="mb-2">
              <img 
                src={`${baseurl}/${originalImages.courseImage}`} 
                alt="Current course image" 
                className="img-thumbnail" 
                style={{ maxHeight: '100px' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
              />
              <p className="text-muted small">Current image</p>
            </div>
          )}
          <input 
            type="file" 
            className="form-control"
            name="courseImage"
            ref={courseImageRef}
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
          />
          <small className="text-muted">Upload new image only if you want to change it</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Course Preview video upload (.mp4)</label>
          {originalImages.courseVideo && (
            <div className="mb-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-film me-2 fs-4"></i>
                <span>Current video: {originalImages.courseVideo.split('/').pop()}</span>
              </div>
            </div>
          )}
          <input 
            type="file" 
            className="form-control"
            name="courseVideo"
            ref={courseVideoRef}
            accept=".mp4"
            onChange={handleFileChange}
          />
          <small className="text-muted">Upload new video only if you want to change it</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Certificate Template (.jpg, .png, .jpeg)</label>
          {originalImages.certificateTemplate && (
            <div className="mb-2">
              <img 
                src={`${baseurl}/${originalImages.certificateTemplate}`} 
                alt="Current certificate template" 
                className="img-thumbnail" 
                style={{ maxHeight: '100px' }} 
                onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
              />
              <p className="text-muted small">Current certificate template</p>
            </div>
          )}
          <input 
            type="file" 
            className="form-control"
            name="certificateTemplate"
            ref={certificateTemplateRef}
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
          />
          <small className="text-muted">Upload new certificate template only if you want to change it</small>
        </div>

        <div className="mb-3">
          <label className="form-label">How much time spend</label>
          <input 
            type="text" 
            className="form-control"
            name="timeSpend"
            placeholder="How much time spend"
            value={formData.timeSpend}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Requirement or Prerequisites</label>
          <textarea 
            className="form-control"
            name="requirements"
            rows="4"
            placeholder="Requirements for taking your course"
            value={formData.requirements}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Level</label>
          <select 
            className="form-select"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Validity (Days)</label>
          <input
            type="number"
            className="form-control"
            name="validityDays"
            placeholder="Course Validity in Days"
            value={formData.validityDays}
            onChange={handleChange}
          />
          <small className="text-muted">Default: 365 days (1 year)</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Course Price</label>
          <div className="input-group">
            <span className="input-group-text">₹</span>
            <input
              type="number"
              className="form-control"
              name="coursePrice"
              placeholder="Course Price"
              value={formData.coursePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <small className="text-muted">Enter 0 for free courses</small>
        </div>

        <div className="mb-4">
          <h3>Lessons</h3>
          <div className="mb-3">
            <button 
              type="button" 
              className="btn btn-primary me-2"
              onClick={() => handleAddLesson('Video')}
            >
              Add Video Lesson
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={() => handleAddLesson('Quiz')}
            >
              Add Quiz
            </button>
          </div>

          {lessons.map((lesson, lessonIndex) => (
            <div key={lessonIndex} className="card mb-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>{lesson.type === 'Video' ? 'Video Lesson' : 'Quiz'} #{lessonIndex + 1}</h4>
                <button 
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveLesson(lessonIndex)}
                >
                  <i className="bi-x"></i>
                </button>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input 
                  type="text"
                  className="form-control"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(lessonIndex, 'title', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows="4"
                  placeholder="Lesson Description"
                  value={lesson.description}
                  onChange={(e) => handleLessonChange(lessonIndex, 'description', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Order</label>
                <input 
                  type="number"
                  className="form-control"
                  placeholder="Lesson Order"
                  value={lesson.order}
                  onChange={(e) => handleLessonChange(lessonIndex, 'order', e.target.value)}
                  required
                />
              </div>

              {lesson.type === 'Video' ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Duration (minutes)</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Duration"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(lessonIndex, 'duration', e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lesson Image</label>
                    {lesson.originalImage && (
                      <div className="mb-2">
                        <img 
                          src={`${baseurl}/${lesson.originalImage}`} 
                          alt="Current lesson image" 
                          className="img-thumbnail" 
                          style={{ maxHeight: '100px' }} 
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
                        />
                        <p className="text-muted small">Current image</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      className="form-control"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) => handleLessonFileChange(lessonIndex, 'image', e.target.files[0])}
                    />
                    <small className="text-muted">Upload new image only if you want to change it</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lesson Video</label>
                    {lesson.originalVideo && (
                      <div className="mb-2">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-film me-2 fs-4"></i>
                          <span>Current video: {lesson.originalVideo.split('/').pop()}</span>
                        </div>
                      </div>
                    )}
                    <input 
                      type="file"
                      className="form-control"
                      accept=".mp4"
                      onChange={(e) => handleLessonFileChange(lessonIndex, 'video', e.target.files[0])}
                    />
                    <small className="text-muted">Upload new video only if you want to change it</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Document URL</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Document URL"
                      value={lesson.document}
                      onChange={(e) => handleLessonChange(lessonIndex, 'document', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="quiz-section">
                  {lesson.questions.map((question, questionIndex) => (
                    <div key={questionIndex} className="card mb-3 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Question #{questionIndex + 1}</h5>
                        {lesson.questions.length > 1 && (
                          <button 
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleRemoveQuestion(lessonIndex, questionIndex)}
                          >
                            <i className="bi-x"></i>
                          </button>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label">Question</label>
                        <input 
                          type="text"
                          className="form-control"
                          placeholder="Enter question"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(lessonIndex, questionIndex, 'question', e.target.value)}
                          required
                        />
                      </div>

                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-3">
                          <label className="form-label">Option {optionIndex + 1}</label>
                          <input 
                            type="text"
                            className="form-control"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleQuestionChange(
                              lessonIndex,
                              questionIndex,
                              'options',
                              e.target.value,
                              optionIndex
                            )}
                            required
                          />
                        </div>
                      ))}

                      <div className="mb-3">
                        <label className="form-label">Correct Answer</label>
                        <select 
                          className="form-select"
                          value={question.correct_answer}
                          onChange={(e) => handleQuestionChange(
                            lessonIndex,
                            questionIndex,
                            'correct_answer',
                            e.target.value
                          )}
                          required
                        >
                          <option value="">Select correct answer</option>
                          {question.options.map((option, idx) => (
                            option && <option key={idx} value={option}>
                              Option {idx + 1}: {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleAddQuestion(lessonIndex)}
                  >
                    Add Another Question
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {loading ? (
          <button type="button" className="btn btn-success me-2" disabled>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Updating...
          </button>
        ) : (
          <>
            <button type="submit" className="btn btn-success me-2">Update Course</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/approved-courses')}>
              Cancel
            </button>
          </>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default EditCourse;