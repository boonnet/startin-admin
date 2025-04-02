import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css'

const AdminSidebar = ({ isCollapsed }) => {
  // Single state to track which menu is open
  const [openMenu, setOpenMenu] = useState(null);
  const [activeLink, setActiveLink] = useState('');
  const location = useLocation();

  // Function to handle menu clicks
  const handleMenuClick = (menuName) => {
    // Close the menu if it's already open, otherwise open it
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // Update active link when location changes
  useEffect(() => {
    const path = location.pathname;
    setActiveLink(path);
    
    // Reset open menu when dashboard is clicked
    if (path === '/dashboard') {
      setOpenMenu(null);
    }
    
    // Auto-expand the parent menu if a submenu link is active
    if (path.includes('/approved-users') || path.includes('/pending-users')) {
      setOpenMenu('users');
    } else if (path.includes('/add-courses') || path.includes('/approved-courses')) {
      setOpenMenu('courses');
    } else if (path.includes('/add-template') || path.includes('/view-template')) {
      setOpenMenu('template');
    } else if (path.includes('/parent-categories') || path.includes('/sub-categories')) {
      setOpenMenu('categories');
    } else if (path.includes('/new-order')) {
      setOpenMenu('orders');
    } else if (path.includes('/payment-settings') || path.includes('/view-payment')) {
      setOpenMenu('payments');
    } else if (path.includes('/default-settings') || path.includes('/logo-management')) {
      setOpenMenu('siteManagement');
    } else if (path.includes('/manage-help-page') || path.includes('/add-help-page') || path.includes('/edit-help-page')) {
      setOpenMenu('helpManagement');
    }
  }, [location]);

  // Check if a link is active
  const isLinkActive = (path) => {
    return activeLink === path;
  };

  return (
    <div className={`sidebar text-white ${isCollapsed ? '' : 'collapsed'}`}>
      <div className="sidebar-content h-100 d-flex flex-column">
        <div className="p-3">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link ${isLinkActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setOpenMenu(null)} // Close all menus when dashboard is clicked
              >
                <div className="d-flex align-items-center w-100">
                  <i className="bi bi-grid"></i>
                  {!isCollapsed && <span className="menu-text">Dashboard</span>}
                </div>
              </Link>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('users')}
                  className={`nav-link ${openMenu === 'users' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-people"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Manage Users</span>
                        {openMenu === 'users' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'users' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/approved-users" 
                        className={`nav-link sub-menu-link ${isLinkActive('/approved-users') ? 'active' : ''}`}
                      >
                        Manage User Details
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('courses')}
                  className={`nav-link ${openMenu === 'courses' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-book"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Manage Courses</span>
                        {openMenu === 'courses' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'courses' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/add-courses" 
                        className={`nav-link sub-menu-link ${isLinkActive('/add-courses') ? 'active' : ''}`}
                      >
                        Add Courses
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/approved-courses" 
                        className={`nav-link sub-menu-link ${isLinkActive('/approved-courses') ? 'active' : ''}`}
                      >
                        View Courses
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('template')}
                  className={`nav-link ${openMenu === 'template' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-file"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Template</span>
                        {openMenu === 'template' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'template' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/add-template" 
                        className={`nav-link sub-menu-link ${isLinkActive('/add-template') ? 'active' : ''}`}
                      >
                        Add Template
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/view-template" 
                        className={`nav-link sub-menu-link ${isLinkActive('/view-template') ? 'active' : ''}`}
                      >
                        View Template
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('categories')}
                  className={`nav-link ${openMenu === 'categories' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-card-list"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Categories</span>
                        {openMenu === 'categories' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'categories' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/parent-categories" 
                        className={`nav-link sub-menu-link ${isLinkActive('/parent-categories') ? 'active' : ''}`}
                      >
                        Parent Category
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/sub-categories" 
                        className={`nav-link sub-menu-link ${isLinkActive('/sub-categories') ? 'active' : ''}`}
                      >
                        Sub Category
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('orders')}
                  className={`nav-link ${openMenu === 'orders' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-cart"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Manage Orders</span>
                        {openMenu === 'orders' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'orders' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/new-order" 
                        className={`nav-link sub-menu-link ${isLinkActive('/new-order') ? 'active' : ''}`}
                      >
                        Course New Orders
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('payments')}
                  className={`nav-link ${openMenu === 'payments' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-wallet2"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Payments</span>
                        {openMenu === 'payments' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'payments' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/payment-settings" 
                        className={`nav-link sub-menu-link ${isLinkActive('/payment-settings') ? 'active' : ''}`}
                      >
                        Payment Settings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/view-payment" 
                        className={`nav-link sub-menu-link ${isLinkActive('/view-payment') ? 'active' : ''}`}
                      >
                        View Payments
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('siteManagement')}
                  className={`nav-link ${openMenu === 'siteManagement' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-gear"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Settings</span>
                        {openMenu === 'siteManagement' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'siteManagement' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/default-settings" 
                        className={`nav-link sub-menu-link ${isLinkActive('/default-settings') ? 'active' : ''}`}
                      >
                        Default Settings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/logo-management" 
                        className={`nav-link sub-menu-link ${isLinkActive('/logo-management') ? 'active' : ''}`}
                      >
                        Logo Management
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <div>
                <button
                  onClick={() => handleMenuClick('helpManagement')}
                  className={`nav-link ${openMenu === 'helpManagement' ? 'active-parent' : ''}`}
                >
                  <div className="d-flex align-items-center w-100">
                    <i className="bi bi-question-circle"></i>
                    {!isCollapsed && (
                      <>
                        <span className="menu-text">Help Management</span>
                        {openMenu === 'helpManagement' ? (
                          <ArrowDown className="arrow-icon" size={18} />
                        ) : (
                          <ArrowRight className="arrow-icon" size={18} />
                        )}
                      </>
                    )}
                  </div>
                </button>
                {openMenu === 'helpManagement' && !isCollapsed && (
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link 
                        to="/manage-help-page" 
                        className={`nav-link sub-menu-link ${isLinkActive('/manage-help-page') ? 'active' : ''}`}
                      >
                        Manage Help Page
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/add-help-page" 
                        className={`nav-link sub-menu-link ${isLinkActive('/add-help-page') ? 'active' : ''}`}
                      >
                        Add Help Page
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        to="/edit-help-page" 
                        className={`nav-link sub-menu-link ${isLinkActive('/edit-help-page') ? 'active' : ''}`}
                      >
                        Edit Help Page
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;