import React, { useState, useRef } from 'react';

const AddHelpPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const editorRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState('paragraph');

  const textStyles = [
    { value: 'h1', label: 'Heading 1', tag: 'h1' },
    { value: 'h2', label: 'Heading 2', tag: 'h2' },
    { value: 'h3', label: 'Heading 3', tag: 'h3' },
    { value: 'paragraph', label: 'Paragraph', tag: 'p' },
    { value: 'blockquote', label: 'Blockquote', tag: 'blockquote' },
    { value: 'pre', label: 'Preformatted', tag: 'pre' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const editorContent = editorRef.current.innerHTML;
    const updatedFormData = {
      ...formData,
      description: editorContent
    };
    console.log('Form submitted:', updatedFormData);
  };

  const handleTitleChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      title: e.target.value
    }));
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleStyleChange = (e) => {
    const style = e.target.value;
    setSelectedStyle(style);
    if (style === 'paragraph') {
      executeCommand('formatBlock', 'p');
    } else if (style.startsWith('h')) {
      executeCommand('formatBlock', style);
    } else if (style === 'blockquote') {
      executeCommand('formatBlock', 'blockquote');
    } else if (style === 'pre') {
      executeCommand('formatBlock', 'pre');
    }
  };

  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleFontSize = (e) => {
    executeCommand('fontSize', e.target.value);
  };

  const handleAlignment = (alignment) => {
    executeCommand(`justify${alignment}`);
  };

  return (
    <div className="container-fluid py-4">
      <h5 className="mb-4">Add Help Page</h5>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Description</label>
          <div className="border rounded">
            {/* Editor Toolbar */}
            <div className="bg-light border-bottom p-2">
              {/* Text Style Dropdown */}
              <select 
                className="btn btn-light border dropdown-toggle me-2"
                value={selectedStyle}
                onChange={handleStyleChange}
              >
                {textStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>

              {/* Font Size Dropdown */}
              <select 
                className="btn btn-light border me-2"
                onChange={handleFontSize}
                defaultValue="3"
              >
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="5">Large</option>
                <option value="7">Extra Large</option>
              </select>

              {/* Text Formatting Buttons */}
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => executeCommand('bold')}
              >
                <strong>B</strong>
              </button>
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => executeCommand('italic')}
              >
                <em>I</em>
              </button>
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => executeCommand('underline')}
              >
                <u>U</u>
              </button>

              {/* Text Alignment Buttons */}
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => handleAlignment('Left')}
              >
                <i className="bi bi-text-left"></i>
              </button>
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => handleAlignment('Center')}
              >
                <i className="bi bi-text-center"></i>
              </button>
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => handleAlignment('Right')}
              >
                <i className="bi bi-text-right"></i>
              </button>

              {/* List Buttons */}
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => executeCommand('insertUnorderedList')}
              >
                <i className="bi bi-list-ul"></i>
              </button>
              <button 
                type="button" 
                className="btn btn-light border me-2"
                onClick={() => executeCommand('insertOrderedList')}
              >
                <i className="bi bi-list-ol"></i>
              </button>

              {/* Link Button */}
              <button 
                type="button" 
                className="btn btn-light border"
                onClick={handleLink}
              >
                <i className="bi bi-link-45deg"></i>
              </button>
            </div>

            {/* Editable Content Area */}
            <div
              ref={editorRef}
              className="form-control border-0"
              contentEditable="true"
              style={{ minHeight: '200px' }}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>

        <button type="submit" className="btn" style={{backgroundColor:'#0133dc', color:'white'}}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddHelpPage;