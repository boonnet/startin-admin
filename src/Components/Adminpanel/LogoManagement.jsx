import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const LogoManagement = () => {
  const [siteIcon, setSiteIcon] = useState(null);
  const [siteLogo, setSiteLogo] = useState(null);
  const [siteDarkLogo, setSiteDarkLogo] = useState(null);

  // State for handling loading, success/error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // State to hold the fetched settings data
  const [settings, setSettings] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);  // Reset any previous errors

        const response = await axios.get(`${baseurl}/api/settings/all`);
        if (response.data && response.data.length > 0) {
          setSettings(response.data[0]);
          setIsCreating(false);
        } else {
          setIsCreating(true);
        }
      } catch (err) {
        // If settings don't exist (404), set isCreating to true
        if (err.response && err.response.status === 404) {
          setIsCreating(true);
        } else {
          setError(err.response?.data?.message || 'An error occurred while fetching settings');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Handle file input change
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  // Submit the form data with images
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!siteIcon && !siteLogo && !siteDarkLogo) {
      setError("At least one image must be selected.");
      return;
    }

    const formData = new FormData();
    
    // Add required site_name field for new settings
    if (isCreating) {
      formData.append('site_name', 'Default Site Name');
    }
    
    if (siteIcon) formData.append('site_icon', siteIcon);
    if (siteLogo) formData.append('site_logo', siteLogo);
    if (siteDarkLogo) formData.append('site_dark_logo', siteDarkLogo);

    try {
      setLoading(true);
      setError(null);

      let response;
      if (isCreating) {
        // Create new settings
        response = await axios.post(`${baseurl}/api/settings/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // If updating, use the uploadSettingsImages endpoint
        response = await axios.post(`${baseurl}/api/settings/upload-images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Update local state with the response data
      if (response.data.settings) {
        setSettings(response.data.settings);
      } else if (response.data.images) {
        // Update the current settings with new image paths
        setSettings(prev => ({
          ...prev,
          ...response.data.images
        }));
      }
      
      setSuccess(true);
      setIsCreating(false);
      
      // Clear file inputs
      setSiteIcon(null);
      setSiteLogo(null);
      setSiteDarkLogo(null);
      
      // Reset file input elements
      document.getElementById('siteIconInput').value = '';
      document.getElementById('siteLogoInput').value = '';
      document.getElementById('siteDarkLogoInput').value = '';
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    return `${baseurl}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <Container fluid className="p-4">
      <h2>{isCreating ? 'Create Logo Settings' : 'Update Logo Settings'}</h2>
      {loading && <Alert variant="info">Loading...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{isCreating ? 'Settings created successfully!' : 'Settings updated successfully!'}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Site Icon */}
        <Form.Group className="mb-4">
          <Form.Label>Site Icon</Form.Label>
          <Form.Control
            id="siteIconInput"
            type="file"
            onChange={(e) => handleFileChange(e, setSiteIcon)}
          />
          <div className="bg-light p-3 mt-2" style={{ width: '100px', height: '100px' }}>
            {!isCreating && settings?.site_icon ? (
              <img
                src={getImageUrl(settings.site_icon)}
                alt="Site Icon"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p className="text-muted">No icon</p>
            )}
          </div>
        </Form.Group>

        {/* Site Lite Logo */}
        <Form.Group className="mb-4">
          <Form.Label>Site Lite Logo</Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            Note: it's used for Landing Page and Admin Side Menu
          </Form.Text>
          <Form.Control
            id="siteLogoInput"
            type="file"
            onChange={(e) => handleFileChange(e, setSiteLogo)}
          />
          <div className="bg-light p-3 mt-2" style={{ width: '200px', height: '100px' }}>
            {!isCreating && settings?.site_logo ? (
              <img
                src={getImageUrl(settings.site_logo)}
                alt="Site Logo"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p className="text-muted">No logo</p>
            )}
          </div>
        </Form.Group>

        {/* Site Dark Logo */}
        <Form.Group className="mb-4">
          <Form.Label>Site Dark Logo</Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            Note: it's used for Mail Template and Admin Login Page
          </Form.Text>
          <Form.Control
            id="siteDarkLogoInput"
            type="file"
            onChange={(e) => handleFileChange(e, setSiteDarkLogo)}
          />
          <div className="bg-light p-3 mt-2" style={{ width: '200px', height: '100px' }}>
            {!isCreating && settings?.site_dark_logo ? (
              <img
                src={getImageUrl(settings.site_dark_logo)}
                alt="Site Dark Logo"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <p className="text-muted">No dark logo</p>
            )}
          </div>
        </Form.Group>

        <Button type="submit" className="px-4" style={{backgroundColor:'#0133dc', color:'white'}} disabled={loading}>
          {loading ? (isCreating ? 'Creating...' : 'Updating...') : (isCreating ? 'Create' : 'Update')}
        </Button>
      </Form>
    </Container>
  );
};

export default LogoManagement;