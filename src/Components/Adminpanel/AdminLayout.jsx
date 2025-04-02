import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import Dashboard from './Dashboard';
import ManageUsers from './ManageUsers';
import './Adminpanel.css';
import AddCourses from './AddCourses';
import ViewCourses from './ViewCourses';
import EditCourse from './EditCourse';

import MainCategories from './MainCategories';

import AddCategory from './AddCategory';
import EditMainCategory from './EditMainCategory';
import SubCategories from './SubCategories';
import AddSubCategory from './AddSubCategory';
import EditSubCategory from './EditSubCategory';
import CourseNewOrders from './CourseNewOrders';
import LogoManagement from './LogoManagement';
import DefaultSettings from './DefaultSettings';
import PaymentSettings from './PaymentSettings';
import ManageHelpPage from './ManageHelpPage';
import EditHelpPage from './EditHelpPage';
import AddHelpPage from './AddHelpPage';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword'
import AddTemplate from './AddTemplate';
import ViewTemplates from './ViewTemplates';
import ViewPayments from './ViewPayments';
import EditTemplate from './EditTemplate';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 991);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 991);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="admin-layout">
      <AdminNavbar setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`main-content ${isCollapsed ? 'expanded' : ''}`}>
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* User management routes */}
          <Route path="/approved-users" element={<ManageUsers />} />
         
          <Route path="/add-courses" element={<AddCourses />} />

          <Route path="/approved-courses" element={<ViewCourses />} />

          <Route path="/edit-course/:id" element={<EditCourse />} />

          <Route path="/parent-categories" element={<MainCategories />} />
          
          <Route path="/add-category" element={<AddCategory />} />

          <Route path="/edit-main-category/:id" element={<EditMainCategory />} />

          <Route path="/sub-categories" element={<SubCategories />} />

          <Route path="/add-sub-category" element={<AddSubCategory />} />

          <Route path="/edit-sub-category/:id" element={<EditSubCategory />} />

          <Route path="/new-order" element={<CourseNewOrders />} />
          
          <Route path="/logo-management" element={<LogoManagement />} />

          <Route path="/default-settings" element={<DefaultSettings />} />

          <Route path="/payment-settings" element={<PaymentSettings />} />

          <Route path="/manage-help-page" element={<ManageHelpPage />} />

          <Route path="/add-help-page" element={<AddHelpPage />} />

          <Route path="/edit-help-page" element={<EditHelpPage />} />

          <Route path="/edit-profile" element={<EditProfile />} />

          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/add-template" element={<AddTemplate />} />

          <Route path="/view-template" element={<ViewTemplates />} />

          <Route path="/edit-template/:id" element={<EditTemplate />} />

          <Route path="/view-payment" element={<ViewPayments />} />

        </Routes>
      </div>
    </div>
  );
};

export default AdminLayout;