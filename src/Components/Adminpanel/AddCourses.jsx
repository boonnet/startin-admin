import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const AddCourses = () => {
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
    courseDuration: '',
    level: '',
    validityDays: '',
    coursePrice: '',
    courseImage: null,
    courseVideo: null,
    certificateTemplate: null
  });

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
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
    video: null,
    document: null
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

      // Process lessons array to match backend structure
      const processedLessons = lessons.map((lesson, index) => {
        if (lesson.type === 'Video') {
          return {
            lession_title: lesson.title,
            content_type: 'Video',
            lession_order: lesson.order || index + 1,
            description: lesson.description,
            duration: lesson.duration
          };
        } else {
          // Process quiz
          return {
            lession_title: lesson.title,
            content_type: 'Quiz',
            lession_order: lesson.order || index + 1,
            description: lesson.description,
            quiz: {
              quiz_title: lesson.title,
              questions: lesson.questions.map(q => ({
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

      // Convert the courseData to JSON and add it to FormData
      courseFormData.append('data', JSON.stringify(courseData));

      // Add file uploads
      if (formData.courseImage) {
        courseFormData.append('course_image', formData.courseImage);
      }

      if (formData.courseVideo) {
        courseFormData.append('preview_video', formData.courseVideo);
      }

      if (formData.certificateTemplate) {
        courseFormData.append('certificate_template', formData.certificateTemplate);
      }

      // Add lesson files
      lessons.forEach((lesson, index) => {
        if (lesson.type === 'Video') {
          if (lesson.image) {
            courseFormData.append('lesson_images', lesson.image);
          }
          if (lesson.video) {
            courseFormData.append('lesson_videos', lesson.video);
          }
          if (lesson.document) {
            courseFormData.append('lesson_documents', lesson.document);
          }
        }
      });

      const response = await axios.post(`${baseurl}/api/course`, courseFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Reset form
      setFormData({
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

      // Reset file inputs by clearing their values
      if (courseImageRef.current) courseImageRef.current.value = '';
      if (courseVideoRef.current) courseVideoRef.current.value = '';
      if (certificateTemplateRef.current) certificateTemplateRef.current.value = '';

      setLessons([]);
      alert('Course created successfully!');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while creating the course');
      console.error('Error creating course:', err);
      alert(`Failed to create course: ${err.response?.data?.message || err.message}`);
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


  return (
    <div className="container p-4">
      <form onSubmit={handleSubmit}>
        <h2>Add Course</h2>
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
          <input
            type="file"
            className="form-control"
            name="courseImage"
            ref={courseImageRef}
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Course Preview video upload (.mp4)</label>
          <input
            type="file"
            className="form-control"
            name="courseVideo"
            ref={courseVideoRef}
            accept=".mp4"
            onChange={handleFileChange}
            required
          />
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
              className="btn me-2"
              style={{backgroundColor:'#0133dc', color:'white'}}
              onClick={() => handleAddLesson('Video')}
            >
              Add Video Lesson
            </button>
            <button
              type="button"
              className="btn"
              style={{backgroundColor:'#0133dc', color:'white'}}
              onClick={() => handleAddLesson('Quiz')}
            >
              Add Quiz
            </button>
          </div>

          {lessons.map((lesson, index) => (
            <div key={index} className="card mb-3 p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4>{lesson.type === 'Video' ? 'Video Lesson' : 'Quiz'}</h4>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveLesson(index)}
                >
                  <i className="bi-x"></i>
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={lesson.description}
                  onChange={(e) => handleLessonChange(index, 'description', e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={lesson.order}
                  onChange={(e) => handleLessonChange(index, 'order', e.target.value)}
                  required
                />
              </div>

              {lesson.type === 'Video' ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Duration (in minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={lesson.duration}
                      onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lesson Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".jpg,.png,.jpeg"
                      onChange={(e) => handleLessonFileChange(index, 'image', e.target.files[0])}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lesson Video</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".mp4"
                      onChange={(e) => handleLessonFileChange(index, 'video', e.target.files[0])}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lesson Document (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleLessonFileChange(index, 'document', e.target.files[0])}
                    />
                  </div>
                </>
              ) : (
                <>
                  {lesson.questions.map((question, qIndex) => (
                    <div key={qIndex} className="card mb-3 p-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Question {qIndex + 1}</h5>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveQuestion(index, qIndex)}
                          disabled={lesson.questions.length <= 1}
                        >
                          <i className="bi-x"></i>
                        </button>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Question</label>
                        <input
                          type="text"
                          className="form-control"
                          value={question.question}
                          onChange={(e) => handleQuestionChange(index, qIndex, 'question', e.target.value)}
                          required
                        />
                      </div>

                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="mb-3">
                          <label className="form-label">Option {oIndex + 1}</label>
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) => handleQuestionChange(index, qIndex, 'options', e.target.value, oIndex)}
                            required
                          />
                        </div>
                      ))}

                      <div className="mb-3">
                        <label className="form-label">Correct Answer</label>
                        <select
                          className="form-select"
                          value={question.correct_answer}
                          onChange={(e) => handleQuestionChange(index, qIndex, 'correct_answer', e.target.value)}
                          required
                        >
                          <option value="" disabled>Select correct answer</option>
                          {question.options.map((option, oIndex) => (
                            <option key={oIndex} value={option}>
                              {option || `Option ${oIndex + 1}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAddQuestion(index)}
                    >
                      Add Question
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Certificate Template (Optional)</label>
          <input
            type="file"
            className="form-control"
            name="certificateTemplate"
            ref={certificateTemplateRef}
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
          />
        </div>

        <div className="d-grid gap-2">
          <button
            type="submit"
            className="btn"
            style={{backgroundColor:'#0133dc', color:'white', width:'125px'}}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger mt-3">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourses;