import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Management() {
  const [activeTab, setActiveTab] = useState("registrations");
  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  useEffect(() => {
    loadRegistrations();
    loadApplications();
    loadJobApplications();
    loadUserMessages();
    
    
    const interval = setInterval(() => {
      loadRegistrations();
      loadApplications();
      loadJobApplications();
      loadUserMessages();
    }, 2000); // Check every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadRegistrations = () => {
    try {
      const storedRegistrations = localStorage.getItem('userRegistrations');
      if (storedRegistrations) {
        setRegistrations(JSON.parse(storedRegistrations));
      }
    } catch (error) {
      console.error("Error loading registrations:", error);
    }
  };

  const loadApplications = () => {
    try {
      const storedApplications = localStorage.getItem('userApplications');
      if (storedApplications) {
        setApplications(JSON.parse(storedApplications));
      }
    } catch (error) {
      console.error("Error loading applications:", error);
    }
  };

  const loadJobApplications = () => {
    try {
      const storedJobApplications = localStorage.getItem('jobApplications');
      if (storedJobApplications) {
        setJobApplications(JSON.parse(storedJobApplications));
      }
    } catch (error) {
      console.error("Error loading job applications:", error);
    }
  };

  const loadUserMessages = () => {
    try {
      const storedMessages = localStorage.getItem('userComments');
      if (storedMessages) {
        const allMessages = JSON.parse(storedMessages);
        const visibleMessages = allMessages.filter(msg => !msg.deletedByAdmin);
        setUserMessages(visibleMessages);
      }
    } catch (error) {
      console.error("Error loading user messages:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const deleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = userMessages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, deletedByAdmin: true };
        }
        return msg;
      });
      
      
      localStorage.setItem('userComments', JSON.stringify(updatedMessages));
      setUserMessages(updatedMessages.filter(msg => !msg.deletedByAdmin));
    }
  };

  const replyToMessage = (messageId, userName, userEmail) => {
    const reply = prompt(`Reply to ${userName} (${userEmail}):`);
    if (reply && reply.trim() !== "") {
      const updatedMessages = userMessages.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            adminReply: reply.trim(),
            replyDate: new Date().toLocaleString()
          };
        }
        return msg;
      });
      
      
      localStorage.setItem('userComments', JSON.stringify(updatedMessages));
      setUserMessages(updatedMessages);
      alert("Reply sent successfully!");
    }
  };

  const downloadFile = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewApplicationDetails = (application) => {
    alert(`Application Details:\n
User: ${application.userName} (${application.userEmail})
Job: ${application.jobTitle}
CV: ${application.cvFileName || 'Available'}
Cover Letter: ${application.coverLetterFileName || 'Available'}
Applied: ${application.applicationDate}`);
  };

  const viewUserDetails = (user) => {
    alert(`User Details:\n
Name: ${user.firstName} ${user.middleName} ${user.lastName}
Email: ${user.email}
Phone: ${user.phoneNumber}
ID Number: ${user.idNumber}
Gender: ${user.gender}
Date of Birth: ${user.dateOfBirth}
Marital Status: ${user.maritalStatus}
Form Four Number: ${user.formFourNumber}
Registration Date: ${user.registrationDate}`);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div 
        className={`bg-dark text-white vh-100 p-3 position-fixed sidebar-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ zIndex: 1000 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!sidebarCollapsed && <h5 className="text-center mb-0">Admin Panel</h5>}
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        <div className="nav flex-column">
          <button 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <i className="fas fa-users me-3"></i>
            {!sidebarCollapsed && <span>Registrations ({registrations.length})</span>}
          </button>
          
          <button 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeTab === 'jobApplications' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobApplications')}
          >
            <i className="fas fa-briefcase me-3"></i>
            {!sidebarCollapsed && <span>Job Applications ({jobApplications.length})</span>}
          </button>
          
          <button 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-file me-3"></i>
            {!sidebarCollapsed && <span>Documents ({applications.length})</span>}
          </button>
          
          <button 
            className={`text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <i className="fas fa-comments me-3"></i>
            {!sidebarCollapsed && <span>Messages ({userMessages.length})</span>}
          </button>
          
          <div className="mt-auto">
            <button 
              className="text-white text-decoration-none py-3 px-3 rounded mb-2 d-flex align-items-center nav-item"
              onClick={() => {
                localStorage.removeItem('adminAuthenticated');
                window.location.href = '/admin-login';
              }}
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-grow-1 p-4 content-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        {/* Toggle button for mobile */}
        <button 
          className="btn btn-dark d-md-none position-fixed m-3"
          style={{ zIndex: 1001 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            {activeTab === 'registrations' && 'User Registrations'}
            {activeTab === 'jobApplications' && 'Job Applications'}
            {activeTab === 'documents' && 'Application Documents'}
            {activeTab === 'messages' && 'User Messages'}
          </h2>
          <div className="d-flex">
            <span className="badge bg-primary me-2">Total Users: {registrations.length}</span>
            <span className="badge bg-success me-2">Applications: {jobApplications.length}</span>
            <span className="badge bg-info">Messages: {userMessages.length}</span>
          </div>
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Registered Users</h5>
            </div>
            <div className="card-body p-0">
              {registrations.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-users fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No users registered yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>ID Number</th>
                        <th>Gender</th>
                        <th>Registration Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((user, index) => (
                        <tr key={index}>
                          <td>{user.firstName} {user.middleName} {user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.phoneNumber}</td>
                          <td>{user.idNumber}</td>
                          <td>{user.gender}</td>
                          <td>{user.registrationDate}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info" 
                              title="View Details"
                              onClick={() => viewUserDetails(user)}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Applications Tab */}
        {activeTab === 'jobApplications' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Job Applications</h5>
            </div>
            <div className="card-body p-0">
              {jobApplications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-briefcase fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No job applications yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Applicant</th>
                        <th>Email</th>
                        <th>Job Position</th>
                        <th>Application Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobApplications.map((application, index) => (
                        <tr key={index}>
                          <td>{application.userName}</td>
                          <td>{application.userEmail}</td>
                          <td>
                            <span className="badge bg-primary">{application.jobTitle}</span>
                          </td>
                          <td>{application.applicationDate}</td>
                          <td>
                            <span className="badge bg-warning">Pending Review</span>
                          </td>
                          <td>
                            <button 
                              className="btn btn-sm btn-info me-1"
                              onClick={() => viewApplicationDetails(application)}
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-success me-1" 
                              title="Download CV"
                              onClick={() => downloadFile(application.cvFile, application.cvFileName)}
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-primary" 
                              title="Download Cover Letter"
                              onClick={() => downloadFile(application.coverLetterFile, application.coverLetterFileName)}
                            >
                              <i className="fas fa-file-download"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Application Documents</h5>
            </div>
            <div className="card-body p-0">
              {applications.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-file fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No application documents yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>CV File</th>
                        <th>Application Letter</th>
                        <th>Submission Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <tr key={index}>
                          <td>{app.userName}</td>
                          <td>{app.userEmail}</td>
                          <td>
                            {app.cvFile ? (
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => downloadFile(app.cvFile, app.cvFileName)}
                              >
                                <i className="fas fa-download me-1"></i>
                                Download CV
                              </button>
                            ) : (
                              <span className="text-muted">No CV</span>
                            )}
                          </td>
                          <td>
                            {app.coverLetterFile ? (
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => downloadFile(app.coverLetterFile, app.coverLetterFileName)}
                              >
                                <i className="fas fa-download me-1"></i>
                                Download Letter
                              </button>
                            ) : (
                              <span className="text-muted">No Letter</span>
                            )}
                          </td>
                          <td>{app.applicationDate}</td>
                          <td>
                            <button className="btn btn-sm btn-info" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">User Messages</h5>
            </div>
            <div className="card-body p-0">
              {userMessages.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-comments fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No messages from users yet.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {userMessages.map((message) => (
                    <div key={message.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1">{message.userName}</h6>
                          <small className="text-muted">{message.userEmail}</small>
                        </div>
                        <small className="text-muted">{message.date}</small>
                      </div>
                      
                      <p className="mb-2">{message.text}</p>
                      
                      {message.file && (
                        <div className="mt-2 mb-3">
                          <span className="fw-semibold">Attachment: </span>
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => downloadFile(message.file, message.fileName)}
                          >
                            <i className="fas fa-download me-1"></i>
                            {message.fileName || 'Download File'}
                          </button>
                        </div>
                      )}
                      
                      {message.adminReply && (
                        <div className="alert alert-info mt-2">
                          <div className="d-flex justify-content-between">
                            <strong>Admin Reply:</strong>
                            <small>{message.replyDate}</small>
                          </div>
                          <p className="mb-0">{message.adminReply}</p>
                        </div>
                      )}
                      
                      <div className="d-flex gap-2 mt-3">
                        {!message.adminReply && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => replyToMessage(message.id, message.userName, message.userEmail)}
                          >
                            <i className="fas fa-reply me-1"></i>
                            Reply
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteMessage(message.id)}
                        >
                          <i className="fas fa-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
              border: none;
              background: none;
              width: 100%;
              text-align: left;
            }
            
            .nav-item:hover {
              background-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            .nav-item.active {
              background-color: rgba(255, 255, 255, 0.2) !important;
            }
            
            .table th {
              border-top: none;
              font-weight: 600;
            }
            
            .badge {
              font-size: 0.75rem;
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

export default Management;
