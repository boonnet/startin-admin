import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import baseurl from '../ApiService/ApiService';

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [subscription, setSubscription] = useState(0);
  const [todayNewUsers, setTodayNewUsers] = useState(0);
  const [course, setCourse] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Generate sample data with realistic values
  const chartData = [
    { name: 'Jan', users: 120, trend: 115 },
    { name: 'Feb', users: 145, trend: 140 },
    { name: 'Mar', users: 158, trend: 155 },
    { name: 'Apr', users: 178, trend: 170 },
    { name: 'May', users: 210, trend: 200 },
    { name: 'Jun', users: 245, trend: 230 },
    { name: 'Jul', users: 267, trend: 255 },
    { name: 'Aug', users: 289, trend: 280 },
    { name: 'Sep', users: 320, trend: 310 },
    { name: 'Oct', users: 356, trend: 340 },
    { name: 'Nov', users: 389, trend: 370 },
    { name: 'Dec', users: 410, trend: 400 }
  ];

  const handleSubmit = async () => {
    if (!title || !message) {
      alert("Please enter both title and message");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/notification/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, message }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Notification sent successfully");
        setTitle("");
        setMessage("");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send notification");
    }
  };

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(`${baseurl}/api/user/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setTotalUsers(data.length);
        } else {
          console.error('Unexpected data format:', data);
          setTotalUsers(0);
        }
      } catch (error) {
        console.error('Error fetching total users:', error);
        setTotalUsers(0);
      }
    };

    fetchTotalUsers();
  }, []);

  useEffect(() => {
    const fetchTodayNewUsers = async () => {
      try {
        const response = await fetch(`${baseurl}/api/user/all`);
        const data = await response.json();

        // Filter users created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayUsers = data.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate >= today;
        });

        setTodayNewUsers(todayUsers.length);
      } catch (error) {
        console.error('Error fetching today\'s users:', error);
      }
    };

    fetchTodayNewUsers();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${baseurl}/api/course/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        if (data && Array.isArray(data)) {
          setCourse(data.length);
        } else if (data && typeof data.courses !== 'undefined') {
          setCourse(data.courses.length);
        } else {
          console.error('Unexpected data format:', data);
          setCourse(0);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourse(0);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${baseurl}/api/templates/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const result = await response.json();
  
        const templateArray = result.templates;
        if (Array.isArray(templateArray)) {
          setTemplates(templateArray);
        } else {
          console.error("Unexpected template data format:", result);
          setTemplates([]);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        setTemplates([]);
      }
    };
  
    fetchTemplates();
  }, []);

  // Custom tooltip component for chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label fw-bold">{`${label}`}</p>
          <p className="value">Users: <span className="fw-bold text-primary">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-container bg-light min-vh-100">
      {/* Header with gradient */}
      <div className="header-section text-dark p-4 mb-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <h2 className="fw-bold mb-0">Analytics Dashboard</h2>
              <p className="opacity-75 mb-0">Monitor your platform performance</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container-fluid px-4 pb-5">
        {/* Stats Cards with improved design */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 stat-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-primary bg-opacity-10 text-primary">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <h6 className="card-subtitle text-muted ms-3 mb-0">Total Users</h6>
                </div>
                <h2 className="fw-bold mb-2">{totalUsers}</h2>
                <div className="progress mb-2" style={{ height: '5px' }}>
                  <div className="progress-bar bg-primary" role="progressbar" style={{ width: '75%' }}></div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-success-subtle text-success me-2">+5.3%</span>
                  <small className="text-muted">Since last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 stat-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-success bg-opacity-10 text-success">
                    <i className="bi bi-book-fill"></i>
                  </div>
                  <h6 className="card-subtitle text-muted ms-3 mb-0">Total Courses</h6>
                </div>
                <h2 className="fw-bold mb-2">{course}</h2>
                <div className="progress mb-2" style={{ height: '5px' }}>
                  <div className="progress-bar bg-success" role="progressbar" style={{ width: '60%' }}></div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-success-subtle text-success me-2">+2.8%</span>
                  <small className="text-muted">Since last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 stat-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-info bg-opacity-10 text-info">
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </div>
                  <h6 className="card-subtitle text-muted ms-3 mb-0">Templates</h6>
                </div>
                <h2 className="fw-bold mb-2">{templates.length}</h2>
                <div className="progress mb-2" style={{ height: '5px' }}>
                  <div className="progress-bar bg-info" role="progressbar" style={{ width: '45%' }}></div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-success-subtle text-success me-2">+3.5%</span>
                  <small className="text-muted">Since last month</small>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 stat-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="icon-wrapper bg-warning bg-opacity-10 text-warning">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <h6 className="card-subtitle text-muted ms-3 mb-0">New Today</h6>
                </div>
                <h2 className="fw-bold mb-2">{todayNewUsers}</h2>
                <div className="progress mb-2" style={{ height: '5px' }}>
                  <div className="progress-bar bg-warning" role="progressbar" style={{ width: '30%' }}></div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-light text-dark border">Active Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Chart Section */}
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center bg-white border-0 pt-4 px-4 pb-0">
                <div>
                  <h5 className="card-title mb-1">User Growth Analytics</h5>
                  <p className="text-muted small mb-0">Monthly user acquisition trends</p>
                </div>
                <div className="btn-group" role="group">
                  <button type="button" className="btn btn-sm btn-outline-primary active">Monthly</button>
                  <button type="button" className="btn btn-sm btn-outline-primary">Weekly</button>
                  <button type="button" className="btn btn-sm btn-outline-primary">Daily</button>
                </div>
              </div>
              <div className="card-body px-4 pt-3 pb-4">
                <div style={{ height: '380px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="users" 
                        stroke="#0d6efd" 
                        strokeWidth={3}
                        fill="url(#colorUsers)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0d6efd' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="trend" 
                        stroke="#6c757d" 
                        strokeWidth={2}
                        strokeDasharray="5 5" 
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Push Notification Card */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center py-4 px-4">
                <div>
                  <h5 className="card-title mb-1">Push Notification</h5>
                  <p className="text-muted small mb-0">Send notifications to your users</p>
                </div>
                <span className="badge bg-primary-subtle text-primary px-3 py-2">All Users</span>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label fw-semibold">Notification Title</label>
                      <input
                        type="text"
                        className="form-control form-control-lg shadow-none rounded-3"
                        id="title"
                        placeholder="Enter notification title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <div className="form-text">Keep it short and attention-grabbing</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label fw-semibold">Message Content</label>
                      <textarea
                        className="form-control shadow-none rounded-3"
                        id="message"
                        rows="5"
                        placeholder="Enter your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                      <div className="form-text">Maximum 250 characters recommended</div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                <div className="col-12 d-flex">
                  <button 
                    className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-send-fill me-2"></i> Send Notification
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS with improved styling */}
      <style>
        {`
          /* Enhanced custom CSS */
          .dashboard-container {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }
          
          .bg-gradient-primary {
            background: linear-gradient(135deg, #4361ee, #3f37c9);
          }
          
          .card {
            border-radius: 16px;
            transition: all 0.3s ease;
            overflow: hidden;
          }
          
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important;
          }
          
          .stat-card {
            border-left: 4px solid transparent;
          }
          
          .stat-card:nth-child(1) {
            border-left-color: #0d6efd;
          }
          
          .stat-card:nth-child(2) {
            border-left-color: #198754;
          }
          
          .stat-card:nth-child(3) {
            border-left-color: #0dcaf0;
          }
          
          .stat-card:nth-child(4) {
            border-left-color: #ffc107;
          }
          
          .progress {
            border-radius: 10px;
            height: 5px;
            background-color: #f0f2f5;
          }
          
          .progress-bar {
            border-radius: 10px;
          }
          
          .badge {
            padding: 0.5rem 0.8rem;
            border-radius: 8px;
            font-weight: 500;
            letter-spacing: 0.3px;
          }
          
          .icon-wrapper {
            width: 46px;
            height: 46px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
          }
          
          .bg-success-subtle {
            background-color: rgba(25, 135, 84, 0.15);
          }
          
          .bg-primary-subtle {
            background-color: rgba(13, 110, 253, 0.15);
          }
          
          .btn-outline-primary {
            border-color: #dee2e6;
            color: #6c757d;
          }
          
          .btn-outline-primary.active {
            background-color: #0d6efd;
            border-color: #0d6efd;
            color: white;
          }
          
          .card-header {
            border-bottom: none;
          }
          
          .form-control {
            border: 1px solid #dee2e6;
          }
          
          .form-control:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          }
          
          .custom-tooltip {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border: none;
          }
          
          .custom-tooltip p {
            margin: 0;
            padding: 3px 0;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;