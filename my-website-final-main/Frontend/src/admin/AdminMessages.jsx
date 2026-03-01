// src/admin/AdminMessages.jsx - ULTIMATE FIXED VERSION 🔥
// ✅ FIXED: Removed lonely 'i' character at line 6
import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
function AdminMessages() {
  const { messages, replyToMessage, markMessageAsRead, deleteMessage, isAdmin, adminUser } = useAdmin();
  const navigate = useNavigate();
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all'); // all, unread, read, replied

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'unread') return msg.status === 'unread';
    if (filter === 'read') return msg.status === 'read';
    if (filter === 'replied') return msg.status === 'replied';
    return true;
  });

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      markMessageAsRead(message.id);
    }
    setReplyText('');
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert('Please enter a reply message');
      return;
    }

    if (selectedMessage) {
      replyToMessage(
        selectedMessage.id, 
        replyText, 
        adminUser?.email || 'admin@availo.co.tz'
      );
      alert('✅ Reply sent successfully!');
      setReplyText('');
      
      // Refresh selected message
      const updatedMessage = messages.find(m => m.id === selectedMessage.id);
      setSelectedMessage(updatedMessage);
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      alert('🗑️ Message deleted successfully!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0" style={{ color: '#333' }}>
            <i className="fas fa-headset me-2 text-danger"></i>
            Help Center / Messages
          </h2>
          <p className="text-muted mb-0">
            {messages.filter(m => m.status === 'unread').length} unread • {messages.length} total
          </p>
        </div>
      </div>

      <div className="row">
        {/* Messages List */}
        <div className={`col-md-${selectedMessage ? '5' : '12'}`}>
          <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
            <div className="card-header bg-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Inbox</h5>
                <div className="d-flex gap-2">
                  <select 
                    className="form-select form-select-sm"
                    style={{ width: '150px' }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Messages</option>
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No messages found</h6>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredMessages.map(message => (
                    <button
                      key={message.id}
                      className={`list-group-item list-group-item-action d-flex align-items-start p-3 ${
                        selectedMessage?.id === message.id ? 'active' : ''
                      }`}
                      onClick={() => handleSelectMessage(message)}
                      style={{ 
                        borderLeft: message.status === 'unread' ? '4px solid #dc3545' : 'none',
                        backgroundColor: selectedMessage?.id === message.id ? '#dc3545' : 'transparent',
                        color: selectedMessage?.id === message.id ? 'white' : 'inherit'
                      }}
                    >
                      <div className="flex-shrink-0 me-3">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" 
                             style={{ width: '40px', height: '40px' }}>
                          <i className={`fas fa-user ${selectedMessage?.id === message.id ? 'text-white' : 'text-secondary'}`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className={`mb-0 fw-bold ${selectedMessage?.id === message.id ? 'text-white' : ''}`}>
                            {message.name || 'Anonymous'}
                          </h6>
                          <small className={selectedMessage?.id === message.id ? 'text-white-50' : 'text-muted'}>
                            {formatDate(message.createdAt)}
                          </small>
                        </div>
                        <p className={`mb-1 small ${selectedMessage?.id === message.id ? 'text-white' : 'text-muted'}`}>
                          {message.email}
                        </p>
                        <p className={`mb-0 ${selectedMessage?.id === message.id ? 'text-white' : ''}`} style={{ 
                          fontSize: '0.9rem',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {message.message}
                        </p>
                        <div className="mt-2">
                          <span className={`badge ${
                            message.status === 'unread' ? 'bg-danger' : 
                            message.status === 'replied' ? 'bg-success' : 'bg-secondary'
                          }`} style={{ borderRadius: '20px' }}>
                            {message.status}
                          </span>
                          {message.replies && message.replies.length > 0 && (
                            <span className="badge bg-info ms-2" style={{ borderRadius: '20px' }}>
                              {message.replies.length} reply
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Detail & Reply */}
        {selectedMessage && (
          <div className="col-md-7">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-envelope me-2 text-danger"></i>
                  Message Details
                </h5>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                >
                  <i className="fas fa-trash me-1"></i>
                  Delete
                </button>
              </div>
              <div className="card-body">
                {/* User Info */}
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-3"
                       style={{ width: '50px', height: '50px', fontSize: '18px' }}>
                    {selectedMessage.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">{selectedMessage.name || 'Anonymous User'}</h6>
                    <p className="text-muted mb-1 small">{selectedMessage.email}</p>
                    <small className="text-muted">
                      <i className="fas fa-clock me-1"></i>
                      {new Date(selectedMessage.createdAt).toLocaleString('en-TZ')}
                    </small>
                  </div>
                </div>

                {/* Original Message */}
                <div className="mb-4 p-3 bg-light rounded" style={{ borderLeft: '4px solid #dc3545' }}>
                  <h6 className="fw-bold mb-2">Original Message:</h6>
                  <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Reply History */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">
                      <i className="fas fa-reply-all me-2 text-success"></i>
                      Reply History
                    </h6>
                    {selectedMessage.replies.map((reply, index) => (
                      <div key={index} className="mb-3 p-3 bg-white border rounded" style={{ marginLeft: '20px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold small text-success">
                            <i className="fas fa-user-shield me-1"></i>
                            Admin ({reply.adminEmail})
                          </span>
                          <small className="text-muted">
                            {new Date(reply.createdAt).toLocaleString('en-TZ')}
                          </small>
                        </div>
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                <div className="mt-4">
                  <h6 className="fw-bold mb-3">
                    <i className="fas fa-reply me-2 text-primary"></i>
                    Send Reply
                  </h6>
                  <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{ borderRadius: '12px' }}
                  ></textarea>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedMessage(null)}
                    >
                      Close
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMessages;