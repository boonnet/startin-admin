import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const Logo = ({ width = 120, height = 50 }) => {
  const [logoUrl, setLogoUrl] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/settings/1`);
        // Use site_logo from the response data
        if (response.data && response.data.site_logo) {
          setLogoUrl(`${baseurl}/${response.data.site_logo}`);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching logo:', err);
        setError(true);
      }
    };

    fetchLogo();
  }, []);

  if (error || !logoUrl) {
    return (
      <div 
        style={{
          width: width,
          height: height,
          backgroundColor: '#D3D3D3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {error ? 'Logo Error' : 'Loading...'}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Company Logo"
      style={{
        width: width,
        height: height,
        objectFit: 'contain',
        background: 'transparent'
      }}
    />
  );
};

const AdminNavbar = ({ setIsCollapsed, isCollapsed }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
      setIsCollapsed(window.innerWidth <= 991);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Show confirmation popup instead of immediately logging out
  const initiateLogout = (e) => {
    e.preventDefault();
    setShowLogoutConfirm(true);
  };

  // Handle actual logout functionality
  const confirmLogout = () => {
    // Clear all items from localStorage
    localStorage.clear();
    
    // Close the dropdown and confirmation
    setShowDropdown(false);
    setShowLogoutConfirm(false);
    
    // Redirect to the login page
    navigate('/admin/login');
  };

  // Cancel logout
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 fixed-top">
        <div className="container-fluid">
          <button
            className="hamburger-btn"
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <span className={`hamburger-icon ${!isCollapsed ? 'active' : ''}`}>
              <span className="line"></span>
              <span className="line"></span>
              <span className="line"></span>
            </span>
          </button>
          <Link className="navbar-brand" to="/dashboard">
            <Logo width={120} height={50} />
          </Link>
          <div className="ms-auto d-flex align-items-center">
            <div className="user-dropdown-container position-relative">
              <div 
                className="d-flex align-items-center cursor-pointer" 
                onClick={toggleDropdown}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-person-circle me-2" style={{ fontSize: '24px' }}></i>
                <i className="bi bi-chevron-down" style={{ fontSize: '12px' }}></i>
              </div>
              {showDropdown && (
                <div className="position-absolute end-0 mt-2 py-2 bg-white rounded-lg shadow-lg" style={{ 
                  minWidth: '200px',
                  zIndex: 1000,
                  border: '1px solid #e5e7eb'
                }}>
                  <Link 
                    to="/edit-profile" 
                    className="dropdown-item px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                  <Link 
                    to="/change-password" 
                    className="dropdown-item px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Change Password
                  </Link>
                  <a 
                    href="#" 
                    onClick={initiateLogout}
                    className="dropdown-item px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {isMobile && !isCollapsed && (
        <div className="sidebar-overlay" onClick={() => setIsCollapsed(true)} />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1050
        }}>
          <div className="bg-white p-4 rounded shadow" style={{ maxWidth: '400px' }}>
            <div className="mb-3 text-center">
              <h5 className="mb-2">Confirm Sign Out</h5>
              <p className="text-muted">Are you sure you want to sign out?</p>
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button 
                onClick={cancelLogout}
                className="btn btn-outline-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="btn btn-danger"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;