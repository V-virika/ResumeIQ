import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = ({ resumeData }) => {
  const [selectedDomain, setSelectedDomain] = useState('');

  // Domain skill requirements
  const domainSkills = {
    'Web Development': {
      required: ['Html', 'Css', 'Javascript', 'React', 'Node', 'Express', 'Mongodb'],
      courses: ['Full Stack Web Development - Udemy', 'React Complete Guide - Coursera', 'Node.js Masterclass - Udacity']
    },
    'Data Science': {
      required: ['Python', 'Pandas', 'Numpy', 'Sklearn', 'Machine Learning', 'Data Science', 'Sql'],
      courses: ['Data Science Bootcamp - Coursera', 'Machine Learning A-Z - Udemy', 'Python for Data Science - edX']
    },
    'Mobile Development': {
      required: ['Java', 'React', 'Javascript', 'Mobile', 'Android', 'Ios'],
      courses: ['React Native Complete Course - Udemy', 'Android Development - Coursera', 'iOS Development - Udacity']
    },
    'AI/ML': {
      required: ['Python', 'Machine Learning', 'Deep Learning', 'Tensorflow', 'Pytorch', 'Ai', 'Numpy', 'Pandas'],
      courses: ['Deep Learning Specialization - Coursera', 'AI & ML Masterclass - Udemy', 'TensorFlow Developer - Coursera']
    },
    'DevOps': {
      required: ['Docker', 'Kubernetes', 'Aws', 'Git', 'Python', 'Linux'],
      courses: ['DevOps Fundamentals - Udemy', 'AWS Certified Solutions - Coursera', 'Docker & Kubernetes - Udacity']
    }
  };

  const handleDomainChange = (e) => {
    setSelectedDomain(e.target.value);
  };

  // Get user skills from resume data (case-insensitive)
  const userSkills = resumeData?.skills || [];
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase());

  // Calculate skills analysis
  const getSkillsAnalysis = () => {
    if (!selectedDomain) return { required: [], missing: [], courses: [] };

    const domain = domainSkills[selectedDomain];
    const requiredSkills = domain.required;
    const missingSkills = requiredSkills.filter(
      skill => !normalizedUserSkills.includes(skill.toLowerCase())
    );

    return {
      required: requiredSkills,
      missing: missingSkills,
      courses: domain.courses
    };
  };

  const analysis = getSkillsAnalysis();

  // Prepare chart data for missing skills
  const missingSkillsChart = {
    labels: analysis.missing.length > 0 ? analysis.missing : ['No missing skills'],
    datasets: [{
      label: 'Missing Skills',
      data: analysis.missing.length > 0 ? analysis.missing.map(() => 1) : [0],
      backgroundColor: analysis.missing.map((_, idx) => {
        const colors = ['#ff6384', '#ff9f40', '#ffcd56', '#4bc0c0', '#36a2eb', '#9966ff', '#c9cbcf'];
        return colors[idx % colors.length];
      }),
      borderRadius: 8,
      borderWidth: 0
    }]
  };

  const requiredSkillsChart = {
    labels: analysis.required,
    datasets: [{
      label: 'Required Skills',
      data: analysis.required.map(() => 1),
      backgroundColor: analysis.required.map((_, idx) => {
        const gradient = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];
        return gradient[idx % gradient.length];
      }),
      borderRadius: 8,
      borderWidth: 0
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: { 
        display: false
      },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: { size: 11 }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ padding: '30px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <span style={{ fontSize: '2.5em', marginRight: '15px' }}>📊</span>
        <h2 style={{ margin: 0, color: '#667eea', fontSize: '2em' }}>Career Analysis Dashboard</h2>
      </div>

      {/* Domain Selection */}
      <div style={{ 
        marginBottom: '30px', 
        background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', 
        padding: '25px', 
        borderRadius: '15px',
        border: '2px solid #667eea30'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '1.5em', marginRight: '10px' }}>🎯</span>
          <h2 style={{ margin: 0 }}>Select Your Target Domain</h2>
        </div>
        <select 
          value={selectedDomain} 
          onChange={handleDomainChange}
          style={{
            padding: '14px 20px',
            fontSize: '16px',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '10px',
            border: '2px solid #667eea',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#333'
          }}
        >
          <option value="">-- Choose a domain --</option>
          <option value="Web Development">🌐 Web Development</option>
          <option value="Data Science">📈 Data Science</option>
          <option value="Mobile Development">📱 Mobile Development</option>
          <option value="AI/ML">🤖 AI/ML</option>
          <option value="DevOps">⚙️ DevOps</option>
        </select>
      </div>

      {selectedDomain && (
        <>
          {/* Your Current Skills */}
          <div style={{ 
            background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)', 
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '25px',
            border: '2px solid #4CAF50'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5em', marginRight: '10px' }}>✨</span>
              <h2 style={{ margin: 0, color: '#2e7d32' }}>Your Current Skills</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {userSkills.length > 0 ? userSkills.map((skill, idx) => (
                <span key={idx} style={{
                  padding: '10px 18px',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  borderRadius: '25px',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: '0 3px 10px rgba(76, 175, 80, 0.3)',
                  transition: 'transform 0.2s'
                }}>
                  {skill}
                </span>
              )) : <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>📝 No skills detected in resume. Upload a resume first!</p>}
            </div>
          </div>

          {/* Required Skills Chart */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '25px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
              <span style={{ fontSize: '1.5em', marginRight: '10px' }}>📚</span>
              <h2 style={{ margin: 0, color: '#667eea' }}>Required Skills for {selectedDomain}</h2>
            </div>
            <div style={{ maxHeight: '300px' }}>
              <Bar data={requiredSkillsChart} options={chartOptions} />
            </div>
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px'
            }}>
              {analysis.required.map((skill, idx) => (
                <span key={idx} style={{
                  padding: '6px 12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '15px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', 
            padding: '25px', 
            borderRadius: '15px', 
            marginBottom: '25px',
            border: '2px solid #f44336'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5em', marginRight: '10px' }}>🎯</span>
              <h2 style={{ margin: 0, color: '#c62828' }}>Skills You Need to Learn</h2>
            </div>
            {analysis.missing.length > 0 ? (
              <>
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '10px',
                  marginBottom: '15px',
                  maxHeight: '250px'
                }}>
                  <Bar data={missingSkillsChart} options={chartOptions} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {analysis.missing.map((skill, idx) => (
                    <span key={idx} style={{
                      padding: '10px 18px',
                      background: 'linear-gradient(135deg, #f44336 0%, #e53935 100%)',
                      color: 'white',
                      borderRadius: '25px',
                      fontSize: '15px',
                      fontWeight: '600',
                      boxShadow: '0 3px 10px rgba(244, 67, 54, 0.3)'
                    }}>
                      ❌ {skill}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ 
                backgroundColor: 'white', 
                padding: '20px', 
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#4CAF50', fontSize: '1.3em', fontWeight: '600', margin: 0 }}>
                  🎉 Congratulations! You have all required skills for {selectedDomain}!
                </p>
              </div>
            )}
          </div>

          {/* Recommended Courses */}
          <div style={{ 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', 
            padding: '25px', 
            borderRadius: '15px',
            border: '2px solid #2196F3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.5em', marginRight: '10px' }}>🎓</span>
              <h2 style={{ margin: 0, color: '#1565c0' }}>Top Recommended Courses</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {analysis.courses.map((course, idx) => (
                <div key={idx} style={{
                  padding: '18px 20px',
                  backgroundColor: 'white',
                  borderLeft: '5px solid #2196F3',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#333',
                  boxShadow: '0 3px 10px rgba(33, 150, 243, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}>
                  <span style={{ marginRight: '10px' }}>📚</span>
                  {course}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!selectedDomain && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)', 
          padding: '60px 40px', 
          borderRadius: '15px', 
          textAlign: 'center',
          border: '2px dashed #999'
        }}>
          <span style={{ fontSize: '4em', display: 'block', marginBottom: '20px' }}>🎯</span>
          <p style={{ fontSize: '1.3em', color: '#555', fontWeight: '500', margin: 0 }}>
            Please select a domain above to see your skill analysis and course recommendations
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
