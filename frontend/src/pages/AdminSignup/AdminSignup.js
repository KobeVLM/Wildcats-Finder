import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AdminSignup.css';

function AdminSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    username: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdminCodeInput, setShowAdminCodeInput] = useState(false);

  // Admin registration code (you can change this to whatever you want)
  const ADMIN_CODE = 'WILDCATS2024ADMIN';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.adminCode.trim()) {
      newErrors.adminCode = 'Admin registration code is required';
    } else if (formData.adminCode !== ADMIN_CODE) {
      newErrors.adminCode = 'Invalid admin registration code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const requestBody = {
        fName: formData.firstName,
        mName: formData.middleName || '',
        lName: formData.lastName,
        email: formData.email,
        username: formData.username,
        contactNo: formData.contactNo || '',
        password: formData.password,
        role: 'admin'
      };

      console.log('Sending admin registration request:', requestBody);

      const response = await fetch('http://localhost:8080/api/users/register/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Response data:', data);

      if (!response.ok) {
        const errorMsg = typeof data === 'object' ? (data.message || JSON.stringify(data)) : data;
        setErrors({ submit: errorMsg || 'Registration failed' });
        return;
      }

      setSuccessMessage('✓ Admin account created successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <div className="admin-signup-header">
          <div className="admin-icon-container">
            <FaShieldAlt className="admin-icon" />
          </div>
          <h1>Create Admin Account</h1>
          <p>Register a new administrator for the Wildcats Finder system</p>
        </div>

        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-signup-form">
          {/* Name Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'input-error' : ''}
              />
              {errors.firstName && <span className="field-error">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="middleName">Middle Name</label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                placeholder="(Optional)"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'input-error' : ''}
              />
              {errors.lastName && <span className="field-error">{errors.lastName}</span>}
            </div>
          </div>

          {/* Email and Username */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@wildcats.edu"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="admin_username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label htmlFor="contactNo">Contact Number</label>
            <input
              type="tel"
              id="contactNo"
              name="contactNo"
              placeholder="+1 (555) 123-4567"
              value={formData.contactNo}
              onChange={handleChange}
            />
          </div>

          {/* Password Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Admin Code Section */}
          <div className="form-group admin-code-section">
            <label>
              <input
                type="checkbox"
                checked={showAdminCodeInput}
                onChange={(e) => setShowAdminCodeInput(e.target.checked)}
                id="showAdminCode"
              />
              <span className="checkbox-label">I have an admin registration code</span>
            </label>
          </div>

          {showAdminCodeInput && (
            <div className="form-group">
              <label htmlFor="adminCode">Admin Registration Code *</label>
              <input
                type="password"
                id="adminCode"
                name="adminCode"
                placeholder="Enter admin code"
                value={formData.adminCode}
                onChange={handleChange}
                className={errors.adminCode ? 'input-error' : ''}
              />
              {errors.adminCode && <span className="field-error">{errors.adminCode}</span>}
              <small className="help-text">Contact system administrator for the registration code</small>
            </div>
          )}

          {!showAdminCodeInput && (
            <div className="info-box">
              <p>To create an admin account, you need a valid admin registration code. Check the checkbox above to enter it.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login" className="login-link">Login here</Link>
          </p>
          <p>
            Want a regular account? <Link to="/signup" className="signup-link">Create user account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminSignup;
