import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard({ apiBaseUrl }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkills, setFilterSkills] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    certified: 0,
    degreeHolders: 0,
    diplomaHolders: 0
  });
  
  const navigate = useNavigate();

  // Skill icons for different professions
  const skillIcons = {
    "Electrical": "⚡",
    "Construction": "🏗️",
    "Healthcare": "🩺",
    "ICT": "💻",
    "Engineering": "🔧",
    "Education": "👨‍🏫",
    "Business": "📊",
    "Hospitality": "🏨",
    "Agriculture": "🚜",
    "Automotive": "🚗",
    "default": "👨‍💼"
  };

  // Education level colors
  const educationColors = {
    "Certificate": "success",
    "Diploma": "info", 
    "Bachelor's Degree": "primary",
    "Master's Degree": "warning",
    "PhD": "danger",
    "Professional Certification": "dark"
  };

  // Fetch user data on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const registrations = JSON.parse(localStorage.getItem("userRegistrations") || "[]");
    
    if (!user) {
      navigate("/login");
      return;
    }
    
    setCurrentUser(user);
    
    // Simulate fetching all users from API
    setTimeout(() => {
      const usersFromStorage = JSON.parse(localStorage.getItem("allUsersData") || "[]");
      
      // If no data in storage, use demo data
      if (usersFromStorage.length === 0) {
        const demoUsers = generateDemoUsers();
        localStorage.setItem("allUsersData", JSON.stringify(demoUsers));
        setAllUsers(demoUsers);
        setFilteredUsers(demoUsers);
        calculateStats(demoUsers);
      } else {
        setAllUsers(usersFromStorage);
        setFilteredUsers(usersFromStorage);
        calculateStats(usersFromStorage);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  // Generate demo users for testing
  const generateDemoUsers = () => {
    const professions = [
      "Electrical Installation", "Civil Engineering", "Clinical Medicine", 
      "Software Engineering", "Business Administration", "Hotel Management",
      "Agriculture", "Mechanical Engineering", "Nursing", "Education"
    ];
    
    const regions = ["Dar es Salaam", "Arusha", "Mwanza", "Mbeya", "Dodoma", "Tanga"];
    const educationLevels = ["Certificate", "Diploma", "Bachelor's Degree", "Master's Degree"];
    
    const demoUsers = [];
    
    for (let i = 1; i <= 25; i++) {
      const profession = professions[Math.floor(Math.random() * professions.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const education = educationLevels[Math.floor(Math.random() * educationLevels.length)];
      
      demoUsers.push({
        id: i,
        fullName: `User ${i} ${["John", "Mary", "Peter", "Sarah", "James", "Anna"][i % 6]} ${["Doe", "Smith", "Johnson", "Williams", "Brown", "Jones"][i % 6]}`,
        email: `user${i}@example.com`,
        phoneNumber: `+255 7${Math.floor(Math.random() * 90000000 + 10000000)}`,
        region: region,
        area: `${region} Area ${i % 5 + 1}`,
        fieldOfStudy: profession,
        educationLevel: education,
        experienceYears: `${Math.floor(Math.random() * 10)}`,
        gender: i % 2 === 0 ? "Male" : "Female",
        age: Math.floor(Math.random() * 30) + 22,
        registrationDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        profilePhoto: `https://i.pravatar.cc/150?img=${i % 70}`,
        cv: `cv_user_${i}.pdf`,
        transcript: `transcript_user_${i}.pdf`,
        certificates: [`certificate_${i % 3 + 1}.pdf`],
        birthCertificate: `birth_certificate_${i}.pdf`
      });
    }
    
    return demoUsers;
  };

  // Calculate statistics
  const calculateStats = (users) => {
    const certified = users.filter(u => u.educationLevel.includes("Certificate")).length;
    const degreeHolders = users.filter(u => u.educationLevel.includes("Degree")).length;
    const diplomaHolders = users.filter(u => u.educationLevel.includes("Diploma")).length;
    
    setStats({
      totalUsers: users.length,
      certified: certified,
      degreeHolders: degreeHolders,
      diplomaHolders: diplomaHolders
    });
  };

  // Filter users based on search term, skills, and region
  useEffect(() => {
    let filtered = allUsers;
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fieldOfStudy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterSkills) {
      filtered = filtered.filter(user =>
        user.fieldOfStudy.toLowerCase().includes(filterSkills.toLowerCase())
      );
    }
    
    if (filterRegion) {
      filtered = filtered.filter(user =>
        user.region.toLowerCase().includes(filterRegion.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, filterSkills, filterRegion, allUsers]);

  // Get skill icon
  const getSkillIcon = (profession) => {
    for (const [key, icon] of Object.entries(skillIcons)) {
      if (profession.toLowerCase().includes(key.toLowerCase())) {
        return icon;
      }
    }
    return skillIcons.default;
  };

  // Get education badge color
  const getEducationColor = (education) => {
    for (const [key, color] of Object.entries(educationColors)) {
      if (education.includes(key)) {
        return color;
      }
    }
    return "secondary";
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} role="status"></div>
          <h3 className="text-white">Loading Dashboard...</h3>
          <p className="text-light">Fetching professional network data</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      paddingBottom: "50px"
    }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg" style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 168, 255, 0.2)",
        padding: "15px 0"
      }}>
        <div className="container">
          <Link className="navbar-brand text-white fw-bold d-flex align-items-center" to="/dashboard">
            <i className="fas fa-hands-helping me-2 text-info"></i>
            Skills-Connect <span className="badge bg-info ms-2">Pro</span>
          </Link>
          
          <div className="d-flex align-items-center">
            <div className="dropdown">
              <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                <div className="rounded-circle overflow-hidden me-2" style={{ width: "35px", height: "35px" }}>
                  {currentUser?.profilePhoto ? (
                    <img src={currentUser.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div className="bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: "100%", height: "100%" }}>
                      {currentUser?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <span className="d-none d-md-inline">{currentUser?.fullName?.split(" ")[0] || "User"}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user me-2"></i> My Profile</Link></li>
                <li><Link className="dropdown-item" to="/jobs"><i className="fas fa-briefcase me-2"></i> Job Opportunities</Link></li>
                <li><Link className="dropdown-item" to="/applications"><i className="fas fa-file-alt me-2"></i> My Applications</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="fas fa-sign-out-alt me-2"></i> Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="row">
          {/* Left Column - User Details & Filters */}
          <div className="col-lg-4 mb-4">
            {/* Welcome Card */}
            <div className="card shadow border-0 rounded-4 mb-4" style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 168, 255, 0.1)"
            }}>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle overflow-hidden me-3" style={{ width: "70px", height: "70px" }}>
                    {currentUser?.profilePhoto ? (
                      <img src={currentUser.profilePhoto} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: "100%", height: "100%" }}>
                        <i className="fas fa-user fa-2x"></i>
                      </div>
                    )}
                  </div>
                  <div>
                    <h5 className="text-white mb-1">{currentUser?.fullName || "Professional User"}</h5>
                    <p className="text-muted mb-0">
                      <i className="fas fa-map-marker-alt me-1 text-info"></i>
                      {currentUser?.region || "Tanzania"}, {currentUser?.area || "Unknown"}
                    </p>
                    <span className="badge bg-info mt-1">
                      {getSkillIcon(currentUser?.fieldOfStudy || "")} {currentUser?.fieldOfStudy || "Professional"}
                    </span>
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="text-white fw-bold fs-5">{stats.totalUsers}</div>
                    <small className="text-muted">Network</small>
                  </div>
                  <div className="col-4">
                    <div className="text-white fw-bold fs-5">{currentUser?.experienceYears || "0"}+</div>
                    <small className="text-muted">Years Exp</small>
                  </div>
                  <div className="col-4">
                    <div className="text-white fw-bold fs-5">
                      <span className="badge bg-success">{currentUser?.educationLevel?.split(" ")[0] || "Cert"}</span>
                    </div>
                    <small className="text-muted">Education</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Card */}
            <div className="card shadow border-0 rounded-4 mb-4" style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 168, 255, 0.1)"
            }}>
              <div className="card-header bg-transparent border-bottom" style={{ borderColor: "rgba(0, 168, 255, 0.2)" }}>
                <h6 className="text-white mb-0">
                  <i className="fas fa-filter me-2 text-info"></i>
                  Filter Professionals
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label text-light">Search by Name/Profession</label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <i className="fas fa-search text-light"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-transparent text-light border-start-0"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">Filter by Skills</label>
                  <select
                    className="form-select bg-transparent text-light"
                    value={filterSkills}
                    onChange={(e) => setFilterSkills(e.target.value)}
                    style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}
                  >
                    <option value="">All Skills</option>
                    <option value="Electrical">Electrical & Electronics</option>
                    <option value="Construction">Construction & Engineering</option>
                    <option value="Healthcare">Healthcare & Medical</option>
                    <option value="ICT">ICT & Technology</option>
                    <option value="Business">Business & Administration</option>
                    <option value="Education">Education & Teaching</option>
                    <option value="Hospitality">Hospitality & Tourism</option>
                    <option value="Agriculture">Agriculture</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label text-light">Filter by Region</label>
                  <select
                    className="form-select bg-transparent text-light"
                    value={filterRegion}
                    onChange={(e) => setFilterRegion(e.target.value)}
                    style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}
                  >
                    <option value="">All Regions</option>
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Arusha">Arusha</option>
                    <option value="Mwanza">Mwanza</option>
                    <option value="Mbeya">Mbeya</option>
                    <option value="Dodoma">Dodoma</option>
                    <option value="Tanga">Tanga</option>
                    <option value="Morogoro">Morogoro</option>
                    <option value="Zanzibar">Zanzibar</option>
                  </select>
                </div>

                <button
                  className="btn btn-outline-light w-100"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSkills("");
                    setFilterRegion("");
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="card shadow border-0 rounded-4" style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 168, 255, 0.1)"
            }}>
              <div className="card-header bg-transparent border-bottom" style={{ borderColor: "rgba(0, 168, 255, 0.2)" }}>
                <h6 className="text-white mb-0">
                  <i className="fas fa-chart-bar me-2 text-info"></i>
                  Network Statistics
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Total Professionals</span>
                    <span className="text-white fw-bold">{stats.totalUsers}</span>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}>
                    <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Certificate Holders</span>
                    <span className="text-white fw-bold">{stats.certified}</span>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}>
                    <div className="progress-bar bg-success" style={{ width: `${(stats.certified / stats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Diploma Holders</span>
                    <span className="text-white fw-bold">{stats.diplomaHolders}</span>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}>
                    <div className="progress-bar bg-info" style={{ width: `${(stats.diplomaHolders / stats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-light">Degree Holders</span>
                    <span className="text-white fw-bold">{stats.degreeHolders}</span>
                  </div>
                  <div className="progress" style={{ height: "8px", background: "rgba(255,255,255,0.1)" }}>
                    <div className="progress-bar bg-warning" style={{ width: `${(stats.degreeHolders / stats.totalUsers) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Users List */}
          <div className="col-lg-8">
            {/* Users Header */}
            <div className="card shadow border-0 rounded-4 mb-4" style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(0, 168, 255, 0.1)"
            }}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="text-white mb-1">
                      <i className="fas fa-users me-2 text-info"></i>
                      Professional Network
                    </h4>
                    <p className="text-muted mb-0">
                      Showing {filteredUsers.length} of {allUsers.length} professionals
                    </p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-info">
                      <i className="fas fa-download me-2"></i>
                      Export
                    </button>
                    <Link to="/register" className="btn btn-primary">
                      <i className="fas fa-user-plus me-2"></i>
                      Add Professional
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length === 0 ? (
              <div className="card shadow border-0 rounded-4 text-center p-5" style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "2px dashed rgba(0, 168, 255, 0.3)"
              }}>
                <i className="fas fa-users-slash text-muted fa-4x mb-3"></i>
                <h4 className="text-white mb-3">No Professionals Found</h4>
                <p className="text-muted mb-4">Try adjusting your search filters to find professionals</p>
                <button
                  className="btn btn-outline-light"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterSkills("");
                    setFilterRegion("");
                  }}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="col">
                    <div 
                      className="card shadow border-0 rounded-4 h-100 user-card"
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(0, 168, 255, 0.1)",
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                      }}
                      onClick={() => handleUserSelect(user)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.borderColor = "rgba(0, 168, 255, 0.5)";
                        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 168, 255, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "rgba(0, 168, 255, 0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div className="card-body">
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle overflow-hidden me-3" style={{ width: "60px", height: "60px" }}>
                            <img 
                              src={user.profilePhoto} 
                              alt={user.fullName}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="text-white mb-1">{user.fullName}</h5>
                            <p className="text-muted mb-1">
                              <i className="fas fa-briefcase me-1 text-info"></i>
                              {user.fieldOfStudy}
                            </p>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-secondary me-2">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {user.region}
                              </span>
                              <span className={`badge bg-${getEducationColor(user.educationLevel)}`}>
                                {user.educationLevel.split(" ")[0]}
                              </span>
                            </div>
                          </div>
                          <div className="text-end">
                            <span style={{ fontSize: "1.5rem" }}>
                              {getSkillIcon(user.fieldOfStudy)}
                            </span>
                          </div>
                        </div>

                        <div className="row text-center mb-3">
                          <div className="col-4">
                            <div className="text-white fw-bold">{user.experienceYears}+</div>
                            <small className="text-muted">Years</small>
                          </div>
                          <div className="col-4">
                            <div className="text-white fw-bold">{user.age}</div>
                            <small className="text-muted">Age</small>
                          </div>
                          <div className="col-4">
                            <div className="text-white fw-bold">
                              {user.gender === "Male" ? "♂" : "♀"}
                            </div>
                            <small className="text-muted">Gender</small>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                          <button 
                            className="btn btn-sm btn-outline-info"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUserSelect(user);
                            }}
                          >
                            <i className="fas fa-eye me-1"></i>
                            View Details
                          </button>
                          <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                            <i className="fas fa-calendar-alt me-1"></i>
                            Joined: {new Date(user.registrationDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 rounded-4" style={{
              background: "linear-gradient(135deg, #0f2027, #203a43)",
              border: "1px solid rgba(0, 168, 255, 0.3)"
            }}>
              <div className="modal-header border-bottom" style={{ borderColor: "rgba(0, 168, 255, 0.2)" }}>
                <h5 className="modal-title text-white">
                  <i className="fas fa-user-circle me-2"></i>
                  Professional Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Profile Info */}
                  <div className="col-md-4 text-center">
                    <div className="rounded-circle overflow-hidden mx-auto mb-3" style={{ width: "150px", height: "150px" }}>
                      <img 
                        src={selectedUser.profilePhoto} 
                        alt={selectedUser.fullName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <h4 className="text-white mb-2">{selectedUser.fullName}</h4>
                    <div className="badge bg-primary mb-3" style={{ fontSize: "1.1rem" }}>
                      {getSkillIcon(selectedUser.fieldOfStudy)} {selectedUser.fieldOfStudy}
                    </div>
                    
                    <div className="card mt-3" style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(0, 168, 255, 0.2)"
                    }}>
                      <div className="card-body">
                        <h6 className="text-white mb-3">Quick Stats</h6>
                        <div className="row text-center">
                          <div className="col-6 mb-3">
                            <div className="text-white fw-bold fs-4">{selectedUser.age}</div>
                            <small className="text-muted">Age</small>
                          </div>
                          <div className="col-6 mb-3">
                            <div className="text-white fw-bold fs-4">{selectedUser.experienceYears}+</div>
                            <small className="text-muted">Experience</small>
                          </div>
                          <div className="col-6">
                            <div className="text-white fw-bold fs-4">
                              {selectedUser.gender === "Male" ? "♂" : "♀"}
                            </div>
                            <small className="text-muted">Gender</small>
                          </div>
                          <div className="col-6">
                            <div className="text-white fw-bold">
                              <span className={`badge bg-${getEducationColor(selectedUser.educationLevel)}`}>
                                {selectedUser.educationLevel}
                              </span>
                            </div>
                            <small className="text-muted">Education</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="col-md-8">
                    <div className="row">
                      <div className="col-12 mb-4">
                        <h5 className="text-white border-bottom pb-2" style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}>
                          <i className="fas fa-info-circle me-2"></i>
                          Contact Information
                        </h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Email Address</label>
                            <p className="text-white">
                              <i className="fas fa-envelope me-2 text-info"></i>
                              {selectedUser.email}
                            </p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Phone Number</label>
                            <p className="text-white">
                              <i className="fas fa-phone me-2 text-info"></i>
                              {selectedUser.phoneNumber}
                            </p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Region</label>
                            <p className="text-white">
                              <i className="fas fa-map-marker-alt me-2 text-info"></i>
                              {selectedUser.region}
                            </p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Area/District</label>
                            <p className="text-white">
                              <i className="fas fa-map-pin me-2 text-info"></i>
                              {selectedUser.area}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 mb-4">
                        <h5 className="text-white border-bottom pb-2" style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}>
                          <i className="fas fa-graduation-cap me-2"></i>
                          Education & Skills
                        </h5>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Education Level</label>
                            <p className="text-white">
                              <span className={`badge bg-${getEducationColor(selectedUser.educationLevel)}`}>
                                {selectedUser.educationLevel}
                              </span>
                            </p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Field of Expertise</label>
                            <p className="text-white">{selectedUser.fieldOfStudy}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Years of Experience</label>
                            <p className="text-white">{selectedUser.experienceYears} years</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <label className="text-muted">Registration Date</label>
                            <p className="text-white">{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <h5 className="text-white border-bottom pb-2" style={{ borderColor: "rgba(0, 168, 255, 0.3)" }}>
                          <i className="fas fa-file-alt me-2"></i>
                          Documents
                        </h5>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="card text-center" style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(0, 168, 255, 0.2)"
                            }}>
                              <div className="card-body">
                                <i className="fas fa-file-pdf text-danger fa-2x mb-2"></i>
                                <h6 className="text-white mb-2">CV/Resume</h6>
                                <button className="btn btn-sm btn-outline-danger w-100">
                                  <i className="fas fa-download me-1"></i>
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card text-center" style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(0, 168, 255, 0.2)"
                            }}>
                              <div className="card-body">
                                <i className="fas fa-file-alt text-warning fa-2x mb-2"></i>
                                <h6 className="text-white mb-2">Transcript</h6>
                                <button className="btn btn-sm btn-outline-warning w-100">
                                  <i className="fas fa-download me-1"></i>
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="card text-center" style={{
                              background: "rgba(255, 255, 255, 0.05)",
                              border: "1px solid rgba(0, 168, 255, 0.2)"
                            }}>
                              <div className="card-body">
                                <i className="fas fa-certificate text-success fa-2x mb-2"></i>
                                <h6 className="text-white mb-2">Certificates</h6>
                                <button className="btn btn-sm btn-outline-success w-100">
                                  <i className="fas fa-download me-1"></i>
                                  View (2)
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top" style={{ borderColor: "rgba(0, 168, 255, 0.2)" }}>
                <button 
                  type="button" 
                  className="btn btn-outline-light"
                  onClick={() => setSelectedUser(null)}
                >
                  <i className="fas fa-times me-2"></i>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Handle contact action
                    alert(`Contacting ${selectedUser.fullName}...`);
                  }}
                >
                  <i className="fas fa-envelope me-2"></i>
                  Contact Professional
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-5 py-4" style={{
        background: "rgba(0, 0, 0, 0.3)",
        borderTop: "1px solid rgba(0, 168, 255, 0.2)"
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-white mb-3">
                <i className="fas fa-hands-helping me-2 text-info"></i>
                Skills-Connect
              </h5>
              <p className="text-light" style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                Connecting skilled professionals with opportunities across Tanzania. 
                Your platform for finding talent and showcasing expertise.
              </p>
            </div>
            <div className="col-md-3">
              <h6 className="text-white mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/dashboard" className="text-light text-decoration-none">Dashboard</Link></li>
                <li><Link to="/jobs" className="text-light text-decoration-none">Job Opportunities</Link></li>
                <li><Link to="/profile" className="text-light text-decoration-none">My Profile</Link></li>
                <li><Link to="/applications" className="text-light text-decoration-none">Applications</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6 className="text-white mb-3">Contact</h6>
              <ul className="list-unstyled">
                <li className="text-light mb-2">
                  <i className="fas fa-envelope me-2 text-info"></i>
                  support@skillsconnect.co.tz
                </li>
                <li className="text-light mb-2">
                  <i className="fas fa-phone me-2 text-info"></i>
                  +255 754 000 000
                </li>
                <li className="text-light">
                  <i className="fas fa-map-marker-alt me-2 text-info"></i>
                  Dar es Salaam, Tanzania
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
              &copy; {new Date().getFullYear()} Skills-Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Inline Styles */}
      <style>
        {`
          .user-card:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
          }
          
          .modal-content {
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(0, 168, 255, 0.5);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 168, 255, 0.8);
          }
          
          .form-control, .form-select {
            background-color: rgba(255,255,255,0.05) !important;
            border-color: rgba(0, 168, 255, 0.3) !important;
            color: white !important;
          }
          
          .form-control:focus, .form-select:focus {
            box-shadow: 0 0 0 0.25rem rgba(0, 168, 255, 0.25) !important;
            border-color: #00a8ff !important;
          }
          
          .form-control::placeholder {
            color: rgba(255,255,255,0.5) !important;
          }
        `}
      </style>

      {/* Bootstrap JS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
      ></script>
      
      {/* Font Awesome */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}

export default Dashboard;