import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import baseurl from '../ApiService/ApiService';

const EditTemplate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [templateData, setTemplateData] = useState({
        templateName: '',
        templateDescription: '',
        templatePrice: '',
    });
    const [coverImage, setCoverImage] = useState(null);
    const [fileInputs, setFileInputs] = useState([
        { id: 0, file: null }
    ]);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [existingCoverImage, setExistingCoverImage] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    // Fetch template data when component mounts
    useEffect(() => {
        const fetchTemplateData = async () => {
            try {
                const response = await axios.get(`${baseurl}/api/templates/${id}`);
                // Check if the response has the expected structure
                if (response.data && response.data.template) {
                    const template = response.data.template;
                    
                    setTemplateData({
                        templateName: template.template_name || '',
                        templateDescription: template.description || '',
                        templatePrice: template.price ? template.price.toString() : '0',
                    });
                    
                    // Set existing cover image
                    if (template.cover_image) {
                        setExistingCoverImage(template.cover_image);
                    }
                    
                    // Initialize file inputs based on existing files
                    if (template.files) {
                        let existingFiles = [];
                        try {
                            // Check if files is a string (JSON) or already an array
                            const filesArray = typeof template.files === 'string' 
                                ? JSON.parse(template.files) 
                                : template.files;
                            
                            existingFiles = filesArray.map((file, index) => ({
                                id: index,
                                file: null,
                                existingFile: file
                            }));
                        } catch (error) {
                            console.error('Error parsing template files:', error);
                            existingFiles = [{ id: 0, file: null }];
                        }
                        
                        setFileInputs(existingFiles.length > 0 ? existingFiles : [{ id: 0, file: null }]);
                    }
                    
                    setInitialLoading(false);
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                setMessage('Error loading template data. Please try again.');
                console.error('Fetch error:', error);
                setInitialLoading(false);
            }
        };
        
        fetchTemplateData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCoverImageChange = (event) => {
        const file = event.target.files[0];
        setCoverImage(file);
        
        // Create preview URL for the image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleFileChange = (event, inputId) => {
        const file = event.target.files[0];
        setMessage('');
        setFileInputs(prevInputs =>
            prevInputs.map(input =>
                input.id === inputId ? { ...input, file } : input
            )
        );
    };

    const addFileInput = () => {
        setFileInputs(prevInputs => [
            ...prevInputs,
            { id: prevInputs.length, file: null }
        ]);
    };

    const removeFileInput = (idToRemove) => {
        if (fileInputs.length > 1) {
            setFileInputs(prevInputs =>
                prevInputs.filter(input => input.id !== idToRemove)
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validate required fields
        if (!templateData.templateName.trim()) {
            setMessage('Please enter a template name!');
            return;
        }
        
        if (!templateData.templateDescription.trim()) {
            setMessage('Please enter a template description!');
            return;
        }
        
        // Validate price (if entered)
        if (templateData.templatePrice && isNaN(parseFloat(templateData.templatePrice))) {
            setMessage('Please enter a valid price!');
            return;
        }

        setIsLoading(true);
        
        try {
            const formData = new FormData();
            
            // Add template data to form
            formData.append('templateName', templateData.templateName);
            formData.append('templateDescription', templateData.templateDescription);
            formData.append('templatePrice', templateData.templatePrice || '0');
            
            // Add cover image if a new one was selected - use the field name expected by the backend
            if (coverImage) {
                formData.append('file0', coverImage);
            }
            
            // Track the files that have been added to correctly map their indexes
            let fileIndex = 1; // Start from 1 as file0 is for cover image

            // Add template files with the field names expected by the backend
            fileInputs.forEach((input) => {
                if (input.file) {
                    // Use the proper naming convention for multer (fileX where X is the index)
                    formData.append(`file${fileIndex}`, input.file);
                    fileIndex++;
                }
                
                // If there's an existing file for this input, add its info
                if (input.existingFile) {
                    formData.append(`existingFile${input.id + 1}`, JSON.stringify(input.existingFile));
                }
            });

            // Add information about which files were removed
            formData.append('fileCount', fileInputs.length);

            const response = await axios.put(`${baseurl}/api/templates/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Template updated successfully!');
            
            // Navigate to templates list or details page after successful update
            setTimeout(() => {
                navigate('/view-template');  // Adjusted to match your Cancel button navigation
            }, 2000);
            
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating template. Please try again.');
            console.error('Update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading template data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-8">
                    <div className="card-header">
                        <h5 className="mb-0">Edit Template</h5>
                    </div>
                    <div className="card-body mt-2">
                        <form onSubmit={handleSubmit}>
                            {/* Template Name Input */}
                            <div className="mb-3">
                                <label htmlFor="templateName" className="form-label">Template Name <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="templateName"
                                    name="templateName"
                                    value={templateData.templateName}
                                    onChange={handleInputChange}
                                    placeholder="Enter template name"
                                    required
                                />
                            </div>

                            {/* Template Description */}
                            <div className="mb-3">
                                <label htmlFor="templateDescription" className="form-label">Description <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control"
                                    id="templateDescription"
                                    name="templateDescription"
                                    value={templateData.templateDescription}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Enter template description"
                                    required
                                ></textarea>
                            </div>

                            {/* Cover Image */}
                            <div className="mb-3">
                                <label htmlFor="coverImage" className="form-label">Cover Image</label>
                                
                                {existingCoverImage && !previewImage && (
                                    <div className="mb-2">
                                        <p className="form-text">Current cover image:</p>
                                        <img 
                                            src={`${baseurl}/${existingCoverImage}`} 
                                            alt="Current Cover" 
                                            className="img-thumbnail" 
                                            style={{ maxHeight: '150px' }} 
                                        />
                                    </div>
                                )}
                                
                                <input
                                    type="file"
                                    className="form-control"
                                    id="coverImage"
                                    onChange={handleCoverImageChange}
                                    accept="image/*"
                                />
                                <div className="form-text">Leave empty to keep current image</div>
                                
                                {previewImage && (
                                    <div className="mt-2">
                                        <p className="form-text">New cover image:</p>
                                        <img 
                                            src={previewImage} 
                                            alt="Cover Preview" 
                                            className="img-thumbnail" 
                                            style={{ maxHeight: '150px' }} 
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Template Price */}
                            <div className="mb-3">
                                <label htmlFor="templatePrice" className="form-label">Price</label>
                                <div className="input-group">
                                    <span className="input-group-text">₹</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="templatePrice"
                                        name="templatePrice"
                                        value={templateData.templatePrice}
                                        onChange={handleInputChange}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                                <div className="form-text">Leave blank for free templates</div>
                            </div>

                            {/* File Inputs */}
                            <div className="mb-3">
                                <label className="form-label">Template Files</label>
                                
                                {fileInputs.map((input) => (
                                    <div key={input.id} className="mt-2 mb-3">
                                        {input.existingFile && (
                                            <div className="mb-2">
                                                <p className="form-text">
                                                    Current file: {input.existingFile.name || 'Template file'}
                                                </p>
                                            </div>
                                        )}
                                        
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="flex-grow-1">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id={`fileUpload${input.id}`}
                                                    onChange={(e) => handleFileChange(e, input.id)}
                                                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                />
                                                <div className="form-text">
                                                    {input.existingFile ? 'Leave empty to keep current file' : 'Select new file'}
                                                </div>
                                            </div>
                                            {fileInputs.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={() => removeFileInput(input.id)}
                                                >
                                                    <i className="bi-x"></i>
                                                </button>
                                            )}
                                        </div>
                                        {input.file && (
                                            <div className="form-text">
                                                Selected new file: {input.file.name}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn"
                                    style={{backgroundColor:'#0133dc', color:'white'}}
                                    onClick={addFileInput}
                                >
                                    <i className="bi bi-plus-circle me-2"></i>
                                    Add More Files
                                </button>
                            </div>

                            {message && (
                                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="mt-4 d-flex gap-2">
                                <button 
                                    type="submit" 
                                    className='btn'
                                    style={{backgroundColor:'#0133dc', color:'white'}}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Template'
                                    )}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => navigate('/view-template')}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTemplate;