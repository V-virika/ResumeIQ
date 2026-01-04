import React, { useState } from 'react';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle resume upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(errorResponse.error || 'Upload failed');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setParsedData(data);
      setError(null);
      setLoading(false);
      
      // Pass data to parent component
      if (onUploadSuccess && data.data) {
        onUploadSuccess(data.data);
      }
    } catch (err) {
      setError('Error uploading file: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '30px', 
      backgroundColor: 'white', 
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px' }}>
        <span style={{ fontSize: '2em', marginRight: '15px' }}>📄</span>
        <h2 style={{ margin: 0, color: '#667eea' }}>Upload Your Resume</h2>
      </div>
      <form onSubmit={handleUpload} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="file" 
            accept=".pdf"
            onChange={handleFileChange}
            style={{ 
              flex: '1',
              minWidth: '250px',
              padding: '12px',
              fontSize: '15px'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || !file}
            style={{
              padding: '12px 30px',
              backgroundColor: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: loading || !file ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: loading || !file ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
              minWidth: '160px'
            }}
          >
            {loading ? '⏳ Processing...' : '🚀 Upload Resume'}
          </button>
        </div>
      </form>
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fee', 
          borderLeft: '4px solid #f44336',
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <p style={{ color: '#d32f2f', margin: 0, fontWeight: '500' }}>❌ {error}</p>
        </div>
      )}
      {parsedData && parsedData.data && (
        <div style={{ 
          marginTop: '25px', 
          padding: '25px', 
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          borderRadius: '15px',
          border: '2px solid #4CAF50',
          boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '20px', fontSize: '1.5em' }}>
            ✅ Resume Uploaded Successfully!
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{ 
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '5px' }}>👤 Name</p>
              <p style={{ fontWeight: '600', fontSize: '1.1em', color: '#333' }}>
                {parsedData.data.name || 'Not detected'}
              </p>
            </div>
            <div style={{ 
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '5px' }}>📧 Email</p>
              <p style={{ fontWeight: '600', fontSize: '1.1em', color: '#333', wordBreak: 'break-all' }}>
                {parsedData.data.email || 'Not detected'}
              </p>
            </div>
            <div style={{ 
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '5px' }}>📱 Phone</p>
              <p style={{ fontWeight: '600', fontSize: '1.1em', color: '#333' }}>
                {parsedData.data.mobile_number || 'Not detected'}
              </p>
            </div>
          </div>
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '10px' }}>💡 Skills Detected</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {parsedData.data.skills && parsedData.data.skills.length > 0 ? 
                parsedData.data.skills.map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.9em',
                    fontWeight: '500',
                    boxShadow: '0 2px 5px rgba(102, 126, 234, 0.3)'
                  }}>
                    {skill}
                  </span>
                )) : 
                <span style={{ color: '#999', fontStyle: 'italic' }}>No skills detected</span>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
