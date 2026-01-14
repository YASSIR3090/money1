import React, { useState, useEffect } from "react";
import bgImage from "../Imgs/zawaBg.jpg";
import zawaLogo from "../Imgs/zawaLogo.png";
import { Link, useNavigate } from 'react-router-dom';

function Reset() {
    const [email, setEmail] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1); // 1: Email input, 2: Password reset
    const navigate = useNavigate();

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
        
        // Find user with matching email
        const user = users.find(user => user.email === email);
        const adminUser = adminUsers.find(user => user.email === email);
        
        // Simulate API call delay
        setTimeout(() => {
            if (user || adminUser) {
                setResetSent(true);
                setStep(2);
            } else {
                setError("Email not found. Please check your email or register first.");
            }
            setIsLoading(false);
        }, 1500);
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminUsers = JSON.parse(localStorage.getItem('adminUsers')) || [];
        
        // Find user with matching email and update password
        let userFound = false;
        
        // Update regular user password
        const updatedUsers = users.map(user => {
            if (user.email === email) {
                userFound = true;
                return { ...user, password: newPassword };
            }
            return user;
        });
        
        // Update admin user password
        const updatedAdminUsers = adminUsers.map(user => {
            if (user.email === email) {
                userFound = true;
                return { ...user, password: newPassword };
            }
            return user;
        });
        
        if (userFound) {
            // Save updated users to localStorage
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            localStorage.setItem('adminUsers', JSON.stringify(updatedAdminUsers));
            
            setError("");
            alert("Password reset successfully! You can now login with your new password.");
            navigate('/login');
        } else {
            setError("User not found. Please try again.");
        }
        
        setIsLoading(false);
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100vh",
            }}
        >
            <div
                className="card shadow border-0 rounded-4 p-3 bg-light"
                style={{ maxWidth: "400px", width: "100%" }}
            >
                <div className="d-flex justify-content-center">
                    <img
                        src={zawaLogo}
                        alt="Zawamis Logo"
                        className="img-fluid"
                        style={{ maxHeight: "60px" }}
                    />
                </div>
                <h3 className="text-center display-6">Reset Password</h3>
                
                {!isOnline && (
                    <div className="alert alert-warning" role="alert">
                        <i className="bi bi-wifi-off me-2"></i>
                        Internet connection required to reset password.
                    </div>
                )}
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                {step === 2 ? (
                    <div>
                        <div className="alert alert-info" role="alert">
                            Please enter your new password
                        </div>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control rounded-3 border-1"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    disabled={!isOnline || isLoading}
                                />
                                <small className="text-muted">Minimum 6 characters</small>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control rounded-3 border-1"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={!isOnline || isLoading}
                                />
                            </div>
                            <div className="d-grid gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary border-0 rounded-3"
                                    disabled={!isOnline || isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Resetting...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary border-0 rounded-3"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control rounded-3 border-1"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={!isOnline || isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary border-0 rounded-3 w-100 mb-3"
                            disabled={!isOnline || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Checking...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                        <div className="d-flex justify-content-between mb-3">
                            <Link to="/" className="text-decoration-none">Back to Login</Link>
                            <Link to="/register" className="text-decoration-none">Not Registered?</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Reset;