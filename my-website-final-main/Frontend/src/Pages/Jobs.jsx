import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

import androidImg from "../Imgs/Android.png";
import bootstrapImg from "../Imgs/Bootstrap.png";
import cppImg from "../Imgs/c++.png";  
import css3Img from "../Imgs/Css3.png";
import gitImg from "../Imgs/Git.png";
import githubImg from "../Imgs/Github.png";
import htmlImg from "../Imgs/Html.png";
import javaImg from "../Imgs/Java.png";
import jsImg from "../Imgs/Javascript.png";
import kotlinImg from "../Imgs/Kotlin.png";
import mongodbImg from "../Imgs/MangoDB.png";
import mysqlImg from "../Imgs/Mysql.png";
import nextjsImg from "../Imgs/Nextjs.png";
import nodejsImg from "../Imgs/Nodejs.png";
import phpImg from "../Imgs/Php.png";
import pythonImg from "../Imgs/Python.png";
import reduxImg from "../Imgs/Redux.png";
import sassImg from "../Imgs/Sass.png";
import wordpressImg from "../Imgs/wordpress.png";

function Jobs() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("jobs");

  const technologies = [
    { name: "React", image: null, description: "Build modern user interfaces with React" },
    { name: "Node.js", image: nodejsImg, description: "Server-side JavaScript runtime" },
    { name: "Redux", image: reduxImg, description: "State management for JavaScript apps" },
    { name: "Android", image: androidImg, description: "Native Android app development" },
    { name: "Bootstrap", image: bootstrapImg, description: "Front-end framework for responsive design" },
    { name: "Sass", image: sassImg, description: "CSS preprocessor for better styling" },
    { name: "HTML", image: htmlImg, description: "Markup language for web pages" },
    { name: "CSS3", image: css3Img, description: "Styling language for web pages" },
    { name: "JavaScript", image: jsImg, description: "Programming language for interactive web pages" },
    { name: "Java", image: javaImg, description: "Object-oriented programming language" },
    { name: "Kotlin", image: kotlinImg, description: "Modern programming language for Android" },
    { name: "PHP", image: phpImg, description: "Server-side scripting language" },
    { name: "Python", image: pythonImg, description: "Versatile programming language" },
    { name: "C++", image: cppImg, description: "General-purpose programming language" },
    { name: "MongoDB", image: mongodbImg, description: "NoSQL document database" },
    { name: "MySQL", image: mysqlImg, description: "Relational database management system" },
    { name: "Git", image: gitImg, description: "Version control system" },
    { name: "GitHub", image: githubImg, description: "Code hosting platform for version control" },
    { name: "WordPress", image: wordpressImg, description: "Content management system" },
    { name: "Next.js", image: nextjsImg, description: "React framework for production" }
  ];

  // For React (no image available), use a placeholder
  const reactIndex = technologies.findIndex(tech => tech.name === "React");
  if (reactIndex !== -1) {
    technologies[reactIndex].image = "https://cdn.worldvectorlogo.com/logos/react-2.svg";
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavClick = (item) => {
    setActiveItem(item);
  };

  // Function to track job views for management
  const trackJobView = (jobTitle) => {
    // Get existing job views or initialize empty array
    const jobViews = JSON.parse(localStorage.getItem('jobViews') || '[]');
    
    // Check if this job was already viewed in this session
    const existingViewIndex = jobViews.findIndex(view => 
      view.jobTitle === jobTitle && view.sessionId === sessionStorage.getItem('sessionId')
    );
    
    if (existingViewIndex === -1) {
      // Add new view
      jobViews.push({
        jobTitle,
        viewDate: new Date().toLocaleString(),
        sessionId: sessionStorage.getItem('sessionId') || Math.random().toString(36).substring(2),
        user: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).email : 'Guest'
      });
      
      localStorage.setItem('jobViews', JSON.stringify(jobViews));
    }
    
    // Store session ID if not already set
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', Math.random().toString(36).substring(2));
    }
  };

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

        {/* Header Section */}
        <header className="bg-primary text-white py-5">
          <div className="container text-center">
            <h1 className="display-4 fw-bold">Available Jobs</h1>
            <p className="lead">Find the perfect opportunity that matches your skills</p>
          </div>
        </header>

        {/* Skills Section */}
        <section className="py-5">
          <div className="container">
            <h2 className="text-center mb-5">Technologies We Work With</h2>
            <p className="text-center mb-5">
              Ensure you have sufficient expertise in these technologies to qualify for our job opportunities.
              We're looking for developers skilled in React, Node.js, Redux, Android, Bootstrap, 
              Sass, HTML, CSS3, JavaScript, Java, Kotlin, PHP, Python, C++, MongoDB, MySQL, Git, GitHub, 
              WordPress, and Next.js.
            </p>
            
            <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-4">
              {technologies.map((tech, index) => (
                <div key={index} className="col">
                  <div className="card tech-card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-3">
                      <div className="tech-image-wrapper mb-3">
                        <img 
                          src={tech.image} 
                          alt={tech.name}
                          className="tech-image"
                          style={{ height: '60px', objectFit: 'contain' }}
                        />
                      </div>
                      <h6 className="card-title">{tech.name}</h6>
                      <p className="card-text small text-muted">{tech.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Jobs Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <h2 className="text-center mb-5">Featured Job Opportunities</h2>
            
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className="card job-card h-100 border-0 shadow-sm" onClick={() => trackJobView('Senior React Developer')}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="card-title">Senior React Developer</h4>
                        <span className="badge bg-primary">Remote</span>
                      </div>
                      <span className="badge bg-success">$70-90k</span>
                    </div>
                    <p className="card-text">
                      We're looking for an experienced React developer with strong skills in Redux, 
                      Node.js, and modern JavaScript. You'll be working on cutting-edge web applications.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-1">React</span>
                      <span className="badge bg-light text-dark me-1">Redux</span>
                      <span className="badge bg-light text-dark me-1">Node.js</span>
                      <span className="badge bg-light text-dark">MongoDB</span>
                    </div>
                    <Link 
                      to="/applications?job=Senior React Developer" 
                      className="btn btn-primary"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mb-4">
                <div className="card job-card h-100 border-0 shadow-sm" onClick={() => trackJobView('Full Stack Developer')}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="card-title">Full Stack Developer</h4>
                        <span className="badge bg-info text-dark">Dar es Salaam</span>
                      </div>
                      <span className="badge bg-success">$60-80k</span>
                    </div>
                    <p className="card-text">
                      Join our team as a Full Stack Developer working with modern technologies including 
                      React, Node.js, and either MongoDB or MySQL. Experience with Git required.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-1">React</span>
                      <span className="badge bg-light text-dark me-1">Node.js</span>
                      <span className="badge bg-light text-dark me-1">MySQL</span>
                      <span className="badge bg-light text-dark">Git</span>
                    </div>
                    <Link 
                      to="/applications?job=Full Stack Developer" 
                      className="btn btn-primary"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mb-4">
                <div className="card job-card h-100 border-0 shadow-sm" onClick={() => trackJobView('Android Developer')}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="card-title">Android Developer</h4>
                        <span className="badge bg-info text-dark">Arusha</span>
                      </div>
                      <span className="badge bg-success">$50-70k</span>
                    </div>
                    <p className="card-text">
                      We need an Android developer proficient in Java or Kotlin to build innovative 
                      mobile applications.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-1">Android</span>
                      <span className="badge bg-light text-dark me-1">Java</span>
                      <span className="badge bg-light text-dark me-1">Kotlin</span>
                      <span className="badge bg-light text-dark">REST APIs</span>
                    </div>
                    <Link 
                      to="/applications?job=Android Developer" 
                      className="btn btn-primary"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 mb-4">
                <div className="card job-card h-100 border-0 shadow-sm" onClick={() => trackJobView('WordPress Developer')}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="card-title">WordPress Developer</h4>
                        <span className="badge bg-primary">Remote</span>
                      </div>
                      <span className="badge bg-success">$40-60k</span>
                    </div>
                    <p className="card-text">
                      Looking for a WordPress developer with strong PHP, HTML, CSS, and JavaScript 
                      skills to create custom themes and plugins.
                    </p>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-1">WordPress</span>
                      <span className="badge bg-light text-dark me-1">PHP</span>
                      <span className="badge bg-light text-dark me-1">HTML</span>
                      <span className="badge bg-light text-dark">CSS3</span>
                    </div>
                    <Link 
                      to="/applications?job=WordPress Developer" 
                      className="btn btn-primary"
                    >
                      Apply Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <button className="btn btn-outline-primary">View All Jobs</button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-5 bg-primary text-white">
          <div className="container text-center">
            <h2>Ready to Find Your Dream Job?</h2>
            <p className="lead mb-4">Create your profile and get matched with the perfect opportunity</p>
            <Link to="/register" className="btn btn-light btn-lg me-3">
              Create Profile
            </Link>
            <Link to="/dashboard" className="btn btn-outline-light btn-lg">
              Go to Dashboard
            </Link>
          </div>
        </section>
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
          
          .job-card {
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .job-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          }
          
          .tech-card {
            transition: all 0.3s ease;
          }
          
          .tech-card:hover {
            transform: translateY(-3px);
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
  );
}

export default Jobs;