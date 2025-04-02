import React, { useState } from 'react';
import axios from 'axios';
import baseurl from '../ApiService/ApiService';

const AddTemplate = () => {
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
        
        if (!coverImage) {
            setMessage('Please select a cover image!');
            return;
        }
        
        // Validate price (if entered)
        if (templateData.templatePrice && isNaN(parseFloat(templateData.templatePrice))) {
            setMessage('Please enter a valid price!');
            return;
        }
        
        // Validate files
        const hasFiles = fileInputs.some(input => input.file);
        if (!hasFiles) {
            setMessage('Please select at least one template file!');
            return;
        }

        setIsLoading(true);
        
        try {
            const formData = new FormData();
            
            // Add template data to form
            formData.append('templateName', templateData.templateName);
            formData.append('templateDescription', templateData.templateDescription);
            formData.append('templatePrice', templateData.templatePrice || '0');
            
            // Add cover image with the field name expected by the backend
            formData.append('file0', coverImage);
            
            // Add template files with the field names expected by the backend
            fileInputs.forEach((input, index) => {
                if (input.file) {
                    formData.append(`file${index + 1}`, input.file);
                }
            });

            const response = await axios.post(`${baseurl}/api/templates/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setMessage('Template uploaded successfully!');
            // Reset form
            setTemplateData({
                templateName: '',
                templateDescription: '',
                templatePrice: '',
            });
            setCoverImage(null);
            setPreviewImage(null);
            setFileInputs([{ id: 0, file: null }]);
            
            // Reset file inputs (this is required because the file inputs don't update their value when state changes)
            event.target.reset();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error uploading template. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container ">
            <div className="row">
                <div className="col-md-8">
                        <div className="card-header">
                            <h5 className="mb-0">Add Template</h5>
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
                                    <label htmlFor="coverImage" className="form-label">Cover Image <span className="text-danger">*</span></label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="coverImage"
                                        onChange={handleCoverImageChange}
                                        accept="image/*"
                                        required
                                    />
                                    {previewImage && (
                                        <div className="mt-2">
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
                                    <label className="form-label">Template Files <span className="text-danger">*</span></label>
                                    {fileInputs.map((input) => (
                                        <div key={input.id} className="mt-2 mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="flex-grow-1">
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id={`fileUpload${input.id}`}
                                                        onChange={(e) => handleFileChange(e, input.id)}
                                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                                    />
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
                                                    Selected file: {input.file.name}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        className="btn text-white"
                                        style={{backgroundColor:'#0133dc', color:'white'}}
                                        onClick={addFileInput}
                                    >
                                        <i className="bi bi-plus-circle"></i>
                                        Add More Files
                                    </button>
                                </div>

                                {message && (
                                    <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                                        {message}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <button 
                                        type="submit" 
                                        className="btn"
                                        style={{backgroundColor:'#0133dc', color:'white'}}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Uploading...
                                            </>
                                        ) : (
                                            'Upload Template'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default AddTemplate;