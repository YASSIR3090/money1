
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    profilePhoto: null
  });

  const [comment, setComment] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [comments, setComments] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("profile");
  const [showDeleteOptions, setShowDeleteOptions] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData(parsedData);
      
      // Load user-specific messages after userData is set
      loadUserMessages(parsedData.email);
    }
  }, []);

  const loadUserMessages = (userEmail) => {
    // Load all comments from localStorage
    const savedComments = localStorage.getItem('userComments');
    if (savedComments) {
      const allComments = JSON.parse(savedComments);
      
      // Filter to show only messages for this user and admin replies to this user
      const userMessages = allComments.filter(comment => 
        comment.userEmail === userEmail || 
        (comment.adminReply && comment.targetUserEmail === userEmail)
      );
      
      setComments(userMessages);
    }
  };

  useEffect(() => {
    // Save comments to localStorage whenever they change
    if (comments.length > 0) {
      // First get all existing comments
      const existingComments = JSON.parse(localStorage.getItem('userComments') || '[]');
      
      // Create a map to avoid duplicates
      const commentMap = new Map();
      
      // Add all existing comments to the map
      existingComments.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // Add or update current comments
      comments.forEach(comment => {
        commentMap.set(comment.id, comment);
      });
      
      // Convert back to array and save
      const updatedComments = Array.from(commentMap.values());
      localStorage.setItem('userComments', JSON.stringify(updatedComments));
    }
  }, [comments]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavClick = (item) => {
    setActiveItem(item);
  };

  const handleCommentChange = (e) => {
    const text = e.target.value;
    setComment(text);
    
    // Calculate word count
    const words = text.trim().split(/\s+/);
    const count = text.trim() === '' ? 0 : words.length;
    setWordCount(count);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File size too large. Please select a file smaller than 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (wordCount > 200) {
      alert("Comment exceeds 200 words. Please shorten your message.");
      return;
    }
    
    if (comment.trim() === "" && !selectedFile) {
      alert("Please enter a comment or attach a file.");
      return;
    }
    
    const newComment = {
      id: Date.now(),
      text: comment,
      file: selectedFile ? URL.createObjectURL(selectedFile) : null,
      fileName: selectedFile ? selectedFile.name : null,
      fileType: selectedFile ? selectedFile.type : null,
      date: new Date().toLocaleString(),
      // Add user information for identification
      userEmail: userData.email,
      userName: `${userData.firstName} ${userData.lastName}`,
      // Add deletion flags
      deletedByUser: false,
      deletedByAdmin: false
    };
    
    // Update local state
    setComments([newComment, ...comments]);
    
    setComment("");
    setSelectedFile(null);
    setWordCount(0);
    
    // Clear file input
    const fileInput = document.getElementById('fileAttachment');
    if (fileInput) fileInput.value = "";
    
    alert("Message sent successfully!");
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('fileAttachment');
    if (fileInput) fileInput.value = "";
  };

  // Function to delete a comment (soft delete - marked as deleted by user)
  const deleteCommentForMe = (commentId) => {
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return { ...comment, deletedByUser: true };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setShowDeleteOptions(null);
  };

  // Function to delete a comment for everyone
  const deleteCommentForEveryone = (commentId) => {
    if (window.confirm("Are you sure you want to delete this message for everyone? This action cannot be undone.")) {
      // Update local state
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            deletedByUser: true,
            deletedByAdmin: true,
            text: "This message has been deleted",
            file: null,
            fileName: null,
            fileType: null
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      
      // Update global storage
      const allComments = JSON.parse(localStorage.getItem('userComments') || '[]');
      const updatedAllComments = allComments.map(comment => {
        if (comment.id === commentId) {
          return { 
            ...comment, 
            deletedByUser: true,
            deletedByAdmin: true,
            text: "This message has been deleted",
            file: null,
            fileName: null,
            fileType: null
          };
        }
        return comment;
      });
      
      localStorage.setItem('userComments', JSON.stringify(updatedAllComments));
      setShowDeleteOptions(null);
    }
  };

  const openWhatsApp = (number) => {
    const message = "Hello, I need assistance regarding...";
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };


  const visibleComments = comments.filter(comment => !comment.deletedByUser);

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
            >
              <i className="fas fa-sign-out-alt me-3"></i>
              {!sidebarCollapsed && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-grow-1 p-4 content-transition ${sidebarCollapsed ? 'collapsed' : ''}`}
      >
        {/* Toggle button for mobile */}
        <button 
          className="btn btn-primary d-md-none position-fixed m-3"
          style={{ zIndex: 1001 }}
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Profile & Communication</h2>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <span className="fw-bold">{userData.firstName} {userData.lastName}</span>
              <div className="text-muted small">{userData.email}</div>
            </div>
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center overflow-hidden" 
                 style={{ width: "50px", height: "50px", border: "2px solid #dee2e6" }}>
              {userData.profilePhoto ? (
                <img 
                  src={userData.profilePhoto} 
                  alt="Profile" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <i className="fas fa-user text-primary fs-5"></i>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="card border-0 shadow-sm mb-4 bg-gradient-primary text-white" style={{background: "linear-gradient(135deg, #0062cc, #0095ff)"}}>
          <div className="card-body text-center py-5">
            <h2 className="card-title mb-3">Karibu {userData.firstName}!</h2>
            <p className="card-text fs-5 mb-4">
              We're delighted to have you here. This is your communication hub where you can share your thoughts, 
              questions, and feedback with us. We value your input and are always here to assist you.
            </p>
          </div>
        </div>

        <div className="row">
          {/* Comment Form */}
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Share Your Thoughts</h5>
                <p className="text-muted mb-0">Send us a message (max 200 words)</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-3">
                    <label htmlFor="commentText" className="form-label">Your Message</label>
                    <textarea 
                      className="form-control" 
                      id="commentText" 
                      rows="5"
                      value={comment}
                      onChange={handleCommentChange}
                      placeholder="Write your message here..."
                    ></textarea>
                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">{wordCount}/200 words</small>
                      {wordCount > 200 && (
                        <small className="text-danger">Word limit exceeded</small>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="fileAttachment" className="form-label">Attach File (Optional)</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      id="fileAttachment" 
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <small className="text-muted">Max file size: 5MB (Images, PDF, Word)</small>
                  </div>
                  
                  {selectedFile && (
                    <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
                      <div>
                        <i className="fas fa-paperclip me-2"></i>
                        {selectedFile.name}
                      </div>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={handleRemoveFile}
                        aria-label="Remove file"
                      ></button>
                    </div>
                  )}
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={wordCount > 200}
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Comments History */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Your Messages</h5>
                <span className="badge bg-primary rounded-pill">{visibleComments.length}</span>
              </div>
              <div className="card-body p-0">
                {visibleComments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-comments fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No messages yet. Send us your first message!</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {visibleComments.map((comment) => (
                      <div key={comment.id} className="list-group-item border-0 position-relative">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="fw-bold">You</div>
                          <small className="text-muted">{comment.date}</small>
                        </div>
                        <p className="mb-2">{comment.text}</p>
                        
                        {comment.file && (
                          <div className="mt-2">
                            {comment.fileType && comment.fileType.startsWith('image/') ? (
                              <div>
                                <img 
                                  src={comment.file} 
                                  alt="Attachment" 
                                  className="img-thumbnail"
                                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                                />
                                <div>
                                  <small className="text-muted">
                                    <a href={comment.file} download target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                      <i className="fas fa-download me-1"></i>
                                      Download Image
                                    </a>
                                  </small>
                                </div>
                              </div>
                            ) : (
                              <div className="d-flex align-items-center">
                                <i className="fas fa-file me-2 text-primary"></i>
                                <div>
                                  <div>{comment.fileName}</div>
                                  <small className="text-muted">
                                    <a href={comment.file} download className="text-decoration-none">
                                      <i className="fas fa-download me-1"></i>
                                      Download File
                                    </a>
                                  </small>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Admin reply section */}
                        {comment.adminReply && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="mb-0 text-primary">Admin Response</h6>
                              <small className="text-muted">{comment.replyDate}</small>
                            </div>
                            <p className="mb-0">{comment.adminReply}</p>
                          </div>
                        )}
                        
                        {/* Delete button for user */}
                        <button 
                          className="btn btn-sm btn-outline-danger position-absolute"
                          style={{ top: '10px', right: '10px' }}
                          onClick={() => setShowDeleteOptions(showDeleteOptions === comment.id ? null : comment.id)}
                          title="Delete message"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        
                        {/* Delete options menu */}
                        {showDeleteOptions === comment.id && (
                          <div className="card position-absolute" style={{ top: '40px', right: '10px', zIndex: 1000, width: '200px' }}>
                            <div className="card-body p-2">
                              <h6 className="card-title">Delete Options</h6>
                              <button 
                                className="btn btn-sm btn-outline-secondary w-100 mb-2"
                                onClick={() => deleteCommentForMe(comment.id)}
                              >
                                Delete for me
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger w-100"
                                onClick={() => deleteCommentForEveryone(comment.id)}
                              >
                                Delete for everyone
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">Contact Information</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="border rounded p-3 text-center h-100">
                  <i className="fab fa-whatsapp fs-1 text-success mb-3"></i>
                  <h5>WhatsApp Support</h5>
                  <p className="text-muted">Reach out to us directly on WhatsApp for quick assistance</p>
                  <button 
                    className="btn btn-success"
                    onClick={() => openWhatsApp('255657330116')}
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    +255 657 330 116
                  </button>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="border rounded p-3 text-center h-100">
                  <i className="fab fa-whatsapp fs-1 text-success mb-3"></i>
                  <h5>Alternative WhatsApp</h5>
                  <p className="text-muted">Our secondary WhatsApp number for additional support</p>
                  <button 
                    className="btn btn-success"
                    onClick={() => openWhatsApp('255673309880')}
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    +255 673 309 880
                  </button>
                </div>
              </div>
            </div>
            <div className="alert alert-info mt-3">
              <i className="fas fa-info-circle me-2"></i>
              <strong>Note:</strong> Your messages are securely stored and will remain available even after logging out or closing the browser, similar to WhatsApp.
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
            
            .bg-gradient-primary {
              background: linear-gradient(135deg, #0062cc, #0095ff) !important;
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

export default Profile;
