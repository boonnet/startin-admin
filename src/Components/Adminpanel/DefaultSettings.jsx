import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toast, ToastContainer } from 'react-bootstrap';
import baseurl from '../ApiService/ApiService';

const DefaultSettings = () => {
  const [formData, setFormData] = useState({
    storage_type: 'local',
    site_name: '',
    site_description: '',
    contact_mail: '',
    location_url: '',
    playstore_url: '',
    appstore_url: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    about: '',
    contact_no: '',
    fcm_key: ''
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewSettings, setIsNewSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/settings/all`);
        
        if (response.data.length > 0) {
          const settingsData = response.data[0]; // Get the first settings object
          setSettings(settingsData);
          setFormData(settingsData);
          setIsNewSettings(false); // Settings exist, so we'll update
        } else {
          // No settings found, we'll create new ones
          setIsNewSettings(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // 404 means no settings found, we'll create new ones
          setIsNewSettings(true);
        } else {
          setError(error.message || 'An error occurred while fetching settings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'radio') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked ? value : prevState[name],
      }));
    } else if (name === 'contact_no' && !/^\d*$/.test(value)) {
      // If the input is not numeric, return early (ignore the change)
      return;
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the email format
    if (formData.contact_mail && !isValidEmail(formData.contact_mail)) {
      showToastMessage('Please enter a valid email address', 'danger');
      return;
    }

    // Ensure that contact_no is not empty and contains only numeric characters
    if (formData.contact_no && !/^\d+$/.test(formData.contact_no)) {
      showToastMessage('Contact number must be numeric', 'danger');
      return;
    }

    // Validate site_name is not empty (required field)
    if (!formData.site_name || formData.site_name.trim() === '') {
      showToastMessage('Site name is required', 'danger');
      return;
    }

    try {
      let response;

      if (isNewSettings) {
        // Create new settings
        response = await axios.post(`${baseurl}/api/settings/create`, formData);
        setIsNewSettings(false); // After creation, future submissions will be updates
      } else {
        // Update existing settings
        const settingId = settings.id;
        response = await axios.put(`${baseurl}/api/settings/edit/${settingId}`, formData);
      }

      if (response.status === 200) {
        // Update the settings state with the response data
        if (response.data.settings) {
          setSettings(response.data.settings);
        } else if (response.data.setting) {
          setSettings(response.data.setting);
        }
        
        showToastMessage(isNewSettings ? 'Settings created successfully' : 'Settings updated successfully');
      } else {
        showToastMessage('Error processing settings', 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Network error';
      showToastMessage(errorMessage, 'danger');
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  return (
    <div className="container-fluid p-4">
      <h4 className="mb-4">{isNewSettings ? 'Create Default Settings' : 'Update Default Settings'}</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Site Name */}
        <div className="mb-3">
          <label htmlFor="siteName" className="form-label">Site Name <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            id="siteName"
            name="site_name"
            value={formData.site_name || ""}
            onChange={handleChange}
            placeholder="Site Name"
            required
          />
        </div>

        {/* Site Description */}
        <div className="mb-3">
          <label htmlFor="siteDescription" className="form-label">Site Description</label>
          <textarea
            className="form-control"
            id="siteDescription"
            name="site_description"
            rows="3"
            value={formData.site_description || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Contact Mail */}
        <div className="mb-3">
          <label htmlFor="contactMail" className="form-label">Contact Mail ID</label>
          <input
            type="email"
            className="form-control"
            id="contactMail"
            name="contact_mail"
            value={formData.contact_mail || ""}
            onChange={handleChange}
            placeholder="Contact Email"
          />
        </div>

        {/* Location URL */}
        <div className="mb-3">
          <label htmlFor="locationUrl" className="form-label">Location URL</label>
          <input
            type="url"
            className="form-control"
            id="locationUrl"
            name="location_url"
            value={formData.location_url || ""}
            onChange={handleChange}
            placeholder="Location URL"
          />
        </div>

        {/* Playstore URL */}
        <div className="mb-3">
          <label htmlFor="playstoreUrl" className="form-label">Playstore URL</label>
          <input
            type="url"
            className="form-control"
            id="playstoreUrl"
            name="playstore_url"
            value={formData.playstore_url || ""}
            onChange={handleChange}
            placeholder="Playstore URL"
          />
        </div>

        {/* Appstore URL */}
        <div className="mb-3">
          <label htmlFor="appstoreUrl" className="form-label">Appstore URL</label>
          <input
            type="url"
            className="form-control"
            id="appstoreUrl"
            name="appstore_url"
            value={formData.appstore_url || ""}
            onChange={handleChange}
            placeholder="Appstore URL"
          />
        </div>

        {/* Facebook URL */}
        <div className="mb-3">
          <label htmlFor="facebookUrl" className="form-label">Facebook URL</label>
          <input
            type="url"
            className="form-control"
            id="facebookUrl"
            name="facebook_url"
            value={formData.facebook_url || ""}
            onChange={handleChange}
            placeholder="Facebook URL"
          />
        </div>

        {/* Instagram URL */}
        <div className="mb-3">
          <label htmlFor="instagramUrl" className="form-label">Instagram URL</label>
          <input
            type="url"
            className="form-control"
            id="instagramUrl"
            name="instagram_url"
            value={formData.instagram_url || ""}
            onChange={handleChange}
            placeholder="Instagram URL"
          />
        </div>

        {/* Linkedin URL */}
        <div className="mb-3">
          <label htmlFor="LinkedinUrl" className="form-label">Linkedin URL</label>
          <input
            type="url"
            className="form-control"
            id="LinkedinUrl"
            name="linkedin_url"
            value={formData.linkedin_url || ""}
            onChange={handleChange}
            placeholder="Linkedin URL"
          />
        </div>

        {/* About Us */}
        <div className="mb-3">
          <label htmlFor="aboutUs" className="form-label">About us</label>
          <textarea
            className="form-control"
            id="aboutUs"
            name="about"
            rows="3"
            value={formData.about || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Admin Phone Number */}
        <div className="mb-3">
          <label htmlFor="adminPhone" className="form-label">Admin Phone Number</label>
          <input
            type="tel"
            className="form-control"
            id="adminPhone"
            name="contact_no"
            value={formData.contact_no || ""}
            onChange={handleChange}
            placeholder="Admin Phone Number"
          />
        </div>

        {/* Storage Type Radio Buttons */}
        <div className="mb-3">
          <label className="form-label">Storage Type</label>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="storageLocal"
              name="storage_type"
              value="local"
              checked={formData.storage_type === 'local'}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="storageLocal">
              Local Storage
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="storageS3"
              name="storage_type"
              value="s3"
              checked={formData.storage_type === 's3'}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="storageS3">
              S3 Storage
            </label>
          </div>
        </div>

        {/* FCM Key */}
        <div className="mb-3">
          <label htmlFor="fcmKey" className="form-label">FCM Key</label>
          <textarea
            className="form-control"
            id="fcmKey"
            name="fcm_key"
            rows="3"
            value={formData.fcm_key || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn" style={{backgroundColor:'#0133dc', color:'white'}}>
          {isNewSettings ? 'Create Settings' : 'Update Settings'}
        </button>
      </form>

      {/* Toast notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastType}
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body className={toastType === 'danger' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default DefaultSettings;