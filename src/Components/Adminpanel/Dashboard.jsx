import React, { useState, useEffect } from 'react';
import { Line } from 'recharts';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import baseurl from '../ApiService/ApiService';

// Sample data for the line chart
const chartData = [
  { name: 'Jan', users: 0 },
  { name: 'Feb', users: 0 },
  { name: 'Mar', users: 0 },
  { name: 'Apr', users: 0 },
  { name: 'May', users: 0 },
  { name: 'Jun', users: 0 },
  { name: 'Jul', users: 0 },
  { name: 'Aug', users: 0 },
  { name: 'Sep', users: 0 },
  { name: 'Oct', users: 0 },
  { name: 'Nov', users: 0 },
  { name: 'Dec', users: 0 }
];

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [subscription, setSubscription] = useState(0);
  const [todayNewUsers, setTodayNewUsers] = useState(0);
  const [course, setCourse] = useState(0);
  const [templates, setTemplates] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

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
        // Check if data exists and has the expected structure
        if (data && Array.isArray(data)) {
          setCourse(data.length);
        } else if (data && typeof data.courses !== 'undefined') {
          // If the API returns an object with a courses array
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
  
        // Extract templates array correctly
        const templateArray = result.templates;
        if (Array.isArray(templateArray)) {
          setTemplates(templateArray); // Store array instead of length
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
  

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">Dashboard</h4>

      {/* Stats Cards Row */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center p-4">
              <div className="text-center flex-grow-1">
                <h2 className="mb-0">{totalUsers}</h2>
                <p className="mb-0 text-primary">Total Users</p>
              </div>
              <div className="text-center flex-grow-1">
                <h2 className="mb-0">{course}</h2>
                <p className="mb-0 text-primary">Total Courses</p>
              </div>
              <div className="text-center flex-grow-1">
                <h2 className="mb-0">{templates.length}</h2>
                <p className="mb-0 text-primary">Templates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Stats and New Users Row */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span><span className="text-danger">•</span> Pending Users</span>
                  <span>1</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: '5%' }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span><span className="text-danger">•</span> Pending Courses</span>
                  <span>5</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div className="progress-bar bg-danger" role="progressbar" style={{ width: '31%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm text-white h-100 usercard">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="display-4 mb-0">{todayNewUsers}</h1>
                  <p className="mb-0">Users</p>
                </div>
                <div>
                  <button className="btn btn-outline-light">
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
              </div>
              <p className="mb-0 mt-2">Today New Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart and Notification Row */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">User Details Chart</h5>
              <div style={{ height: '300px' }}>
                <LineChart width={700} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#4f46e5" />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Push Notification</h5>
              <p className="text-muted">Send Push Notification to all users</p>

              {/* Title Input */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Message Textarea */}
              <textarea
                className="form-control mb-3"
                rows="6"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>

              {/* Submit Button */}
              <button className="btn userbtn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;