
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

function Applications({ apiBaseUrl }) {
  const [cvFile, setCvFile] = useState(null);
  const [applicationLetterFile, setApplicationLetterFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("applications");
  const [jobTitle, setJobTitle] = useState("Frontend Developer Position");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCvFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
    } else {
      alert("Please select a PDF file only");
      event.target.value = null;
    }
  };

  const handleApplicationLetterChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setApplicationLetterFile(file);
    } else {
      alert("Please select a PDF file only");
      event.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    if (!cvFile || !applicationLetterFile) {
      setError("Please upload both CV and Application Letter");
      setIsLoading(false);
      return;
    }
    
    try {
      // Get current user data
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.id) {
        setError("User not found. Please login again.");
        setIsLoading(false);
        return;
      }
      
      const formData = new FormData();
      formData.append('user_id', currentUser.id);
      formData.append('job_title', jobTitle);
      formData.append('cv', cvFile);
      formData.append('cover_letter', applicationLetterFile);
      
      const response = await fetch(`${apiBaseUrl}/apply-job/`, {
        method: "POST",
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        
        setShowSuccess(true);
        
      
        const applicationData = {
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userEmail: currentUser.email,
          jobTitle: jobTitle,
          cvFile: URL.createObjectURL(cvFile),
          cvFileName: cvFile.name,
          coverLetterFile: URL.createObjectURL(applicationLetterFile),
          coverLetterFileName: applicationLetterFile.name,
          applicationDate: new Date().toLocaleString()
        };

        
        const existingApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        existingApplications.push(applicationData);
        localStorage.setItem('jobApplications', JSON.stringify(existingApplications));

      
        const documentData = {
          userId: currentUser.id,
          userName: `${currentUser.firstName} ${currentUser.lastName}`,
          userEmail: currentUser.email,
          cvFile: URL.createObjectURL(cvFile),
          cvFileName: cvFile.name,
          coverLetterFile: URL.createObjectURL(applicationLetterFile),
          coverLetterFileName: applicationLetterFile.name,
          applicationDate: new Date().toLocaleString()
        };

        const existingDocuments = JSON.parse(localStorage.getItem('userApplications') || '[]');
        existingDocuments.push(documentData);
        localStorage.setItem('userApplications', JSON.stringify(existingDocuments));
        
      
        setTimeout(() => setShowSuccess(false), 5000);
        
      
        setCvFile(null);
        setApplicationLetterFile(null);
        
        
        document.getElementById('cvUpload').value = '';
        document.getElementById('applicationLetterUpload').value = '';
      } else {
        setError(data.message || "Application submission failed");
      }
    } catch (error) {
      console.error("Application error:", error);
      setError("Application submission error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavClick = (item) => {
    setActiveItem(item);
  };

  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const job = urlParams.get('job');
    if (job) {
      setJobTitle(job);
    }
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div 
        className={`bg-primary text-white vh-100 p-3 position-fixed sidebar-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ zIndex: 1000 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!sidebarCollapsed && <h5 className="text-center mb-0">User Dashboard</h5>}
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="nav flex-column">
          <Link 
            to="/dashboard" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <i className="fas fa-home me-3"></i>
            {!sidebarCollapsed && <span>Overview</span>}
          </Link>
          <Link 
            to="/jobs" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'jobs' ? 'active' : ''}`}
            onClick={() => handleNavClick('jobs')}
          >
            <i className="fas fa-briefcase me-3"></i>
            {!sidebarCollapsed && <span>Jobs</span>}
          </Link>
          <Link 
            to="/applications" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'applications' ? 'active' : ''}`}
            onClick={() => handleNavClick('applications')}
          >
            <i className="fas fa-file-alt me-3"></i>
            {!sidebarCollapsed && <span>Applications</span>}
          </Link>
          
          <Link 
            to="/profile" 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeItem === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <i className="fas fa-user me-3"></i>
            {!sidebarCollapsed && <span>Profile</span>}
          </Link>
          
          <div className="mt-auto">
            <Link 
              to="/login" 
              className="text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item"
              onClick={() => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('currentUser');
              }}
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              {!sidebarCollapsed && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-grow-1 p-0 content-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        {/* Toggle button for mobile */}
        <button 
          className="btn btn-primary d-md-none position-fixed m-3"
          style={{ zIndex: 1001 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Success Alert */}
        {showSuccess && (
          <div className="alert alert-success alert-dismissible fade show mb-0 text-center sticky-top" role="alert" style={{zIndex: 999}}>
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-check-circle me-2 fa-lg"></i>
              <strong>Success!</strong> Your application has been submitted successfully.
              <button type="button" className="btn-close ms-3" onClick={() => setShowSuccess(false)}></button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-0 text-center sticky-top" role="alert" style={{zIndex: 999}}>
            <div className="d-flex align-items-center justify-content-center">
              <i className="fas fa-exclamation-circle me-2 fa-lg"></i>
              <strong>Error!</strong> {error}
              <button type="button" className="btn-close ms-3" onClick={() => setError("")}></button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="bg-primary text-white py-4">
          <div className="container text-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="w-100">
                <h1 className="h3 mb-0">Job Application</h1>
                <p className="mb-0">Submit your application for the selected position</p>
              </div>
              <Link to="/jobs" className="btn btn-light position-absolute end-0 me-4">
                <i className="fas fa-arrow-left me-2"></i> Back to Jobs
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Application Card */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0">
                    <i className="fas fa-briefcase text-primary me-2"></i>
                    {jobTitle}
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="mb-4">
                    <h6 className="text-primary">Application Requirements</h6>
                    <ul className="list-unstyled">
                      <li><i className="fas fa-check text-success me-2"></i> Upload your CV (PDF format)</li>
                      <li><i className="fas fa-check text-success me-2"></i> Upload your application letter (PDF format)</li>
                      <li><i className="fas fa-check text-success me-2"></i> Ensure your contact information is up to date</li>
                    </ul>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* CV Upload Section */}
                    <div className="mb-4">
                      <label htmlFor="cvUpload" className="form-label fw-semibold">
                        <i className="fas fa-file-pdf text-danger me-2"></i>
                        Upload Your CV (PDF only)
                      </label>
                      <div className="file-upload-card border rounded p-4 text-center">
                        <input
                          type="file"
                          className="form-control d-none"
                          id="cvUpload"
                          accept=".pdf"
                          onChange={handleCvFileChange}
                          required
                          disabled={isLoading}
                        />
                        <label htmlFor="cvUpload" className="btn btn-outline-primary mb-3" style={{cursor: isLoading ? 'not-allowed' : 'pointer'}}>
                          <i className="fas fa-cloud-upload-alt me-2"></i>
                          Choose CV File
                        </label>
                        {cvFile ? (
                          <div className="mt-2">
                            <i className="fas fa-file-pdf text-danger fa-2x"></i>
                            <p className="mb-0 mt-2">{cvFile.name}</p>
                            <small className="text-muted">
                              {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <i className="fas fa-file-pdf text-muted fa-2x"></i>
                            <p className="mb-0 mt-2 text-muted">No CV file chosen</p>
                            <small className="text-muted">PDF format only, max file size: 5MB</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Application Letter Upload Section */}
                    <div className="mb-4">
                      <label htmlFor="applicationLetterUpload" className="form-label fw-semibold">
                        <i className="fas fa-file-pdf text-primary me-2"></i>
                        Upload Your Application Letter (PDF only)
                      </label>
                      <div className="file-upload-card border rounded p-4 text-center">
                        <input
                          type="file"
                          className="form-control d-none"
                          id="applicationLetterUpload"
                          accept=".pdf"
                          onChange={handleApplicationLetterChange}
                          required
                          disabled={isLoading}
                        />
                        <label htmlFor="applicationLetterUpload" className="btn btn-outline-primary mb-3" style={{cursor: isLoading ? 'not-allowed' : 'pointer'}}>
                          <i className="fas fa-cloud-upload-alt me-2"></i>
                          Choose Application Letter
                        </label>
                        {applicationLetterFile ? (
                          <div className="mt-2">
                            <i className="fas fa-file-pdf text-primary fa-2x"></i>
                            <p className="mb-0 mt-2">{applicationLetterFile.name}</p>
                            <small className="text-muted">
                              {(applicationLetterFile.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <i className="fas fa-file-pdf text-muted fa-2x"></i>
                            <p className="mb-0 mt-2 text-muted">No application letter chosen</p>
                            <small className="text-muted">PDF format only, max file size: 5MB</small>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!cvFile || !applicationLetterFile || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Submit Application
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Additional Info */}
              <div className="card shadow-sm border-0 mt-4">
                <div className="card-body p-4">
                  <h6 className="text-primary mb-3">
                    <i className="fas fa-info-circle me-2"></i>
                    Application Tips
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex mb-3">
                        <div className="me-3">
                          <i className="fas fa-check-circle text-success fa-lg"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Professional CV</h6>
                          <p className="text-muted small mb-0">Ensure your CV is updated and professional</p>
                        </div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="me-3">
                          <i className="fas fa-check-circle text-success fa-lg"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Tailored Application Letter</h6>
                          <p className="text-muted small mb-0">Customize your letter for this position</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex mb-3">
                        <div className="me-3">
                          <i className="fas fa-check-circle text-success fa-lg"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">PDF Format</h6>
                          <p className="text-muted small mb-0">Save both documents as PDF files</p>
                        </div>
                      </div>
                      <div className="d-flex mb-3">
                        <div className="me-3">
                          <i className="fas fa-check-circle text-success fa-lg"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">File Naming</h6>
                          <p className="text-muted small mb-0">Use clear names like "CV_YourName.pdf"</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        Your application will be reviewed by our HR team. You can check the status in the Applications section.
                      </div>
                    </div>
                    <div className="col-12 mt-3">
                      <div className="alert alert-warning">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        <strong>Note:</strong> Your application data will be visible to administrators in the management system.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add CSS for transitions and sidebar behavior */}
        <style>
          {`
            .sidebar-transition {
              width: 250px;
              transition: width 0.3s ease;
            }
            
            .sidebar-transition.collapsed {
              width: 70px;
            }
            
            .content-transition {
              margin-left: 250px;
              transition: margin-left 0.3s ease;
            }
            
            .content-transition.collapsed {
              margin-left: 70px;
            }
            
            .nav-item {
              transition: all 0.2s ease;
            }
            
            .nav-item:hover {
              background-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            .nav-item.active {
              background-color: rgba(255, 255, 255, 0.2) !important;
            }
            
            .file-upload-card {
              transition: all 0.3s ease;
              background-color: #f8f9fa;
              cursor: pointer;
            }
            
            .file-upload-card:hover {
              background-color: #e9ecef;
              transform: translateY(-2px);
            }
            
            .card {
              border-radius: 12px;
              overflow: hidden;
            }
            
            .alert {
              border-radius: 0;
              border: none;
            }
            
            .btn {
              border-radius: 8px;
              font-weight: 500;
            }
            
            .form-control {
              border-radius: 8px;
              padding: 12px 16px;
            }
            
            .form-control:focus {
              box-shadow: 0 0 0 3px rgba(59, 89, 152, 0.2);
              border-color: #3b5998;
            }

            .bg-primary-dark {
              background-color: rgba(0, 0, 0, 0.2) !important;
            }
            
            @media (max-width: 767.98px) {
              .sidebar-transition {
                width: 250px;
                transform: translateX(-100%);
              }
              
              .sidebar-transition.collapsed {
                transform: translateX(0);
                width: 250px;
              }
              
              .content-transition {
                margin-left: 0 !important;
              }
              
              .content-transition.collapsed {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}

export default Applications;
