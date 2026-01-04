import React, { useState } from 'react';
import ResumeUpload from './ResumeUpload';
import AdminDashboard from './AdminDashboard';

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <div className="App">
      <h1>Resume Analyzer Project</h1>
      <ResumeUpload onUploadSuccess={setResumeData} />
      <AdminDashboard resumeData={resumeData} />
    </div>
  );
}

export default App;
