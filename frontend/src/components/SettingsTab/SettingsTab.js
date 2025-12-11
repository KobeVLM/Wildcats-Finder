import React, { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { FaLock, FaUser, FaEnvelope, FaPhone, FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import './SettingsTab.css';

/**
 * SettingsTab - Account settings for password change and profile update
 */
function SettingsTab() {
    const { user, updateUser } = useContext(UserContext);
    
    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fname: user?.fname || '',
        mname: user?.mname || '',
        lname: user?.lname || '',
        contactNo: user?.contactNo || '',
    });
    
    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    
    // UI state
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    // Handle profile form changes
    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    // Submit profile update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMessage({ type: '', text: '' });
        setLoadingProfile(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...user,
                    fName: profileForm.fname,
                    mName: profileForm.mname,
                    lName: profileForm.lname,
                    contactNo: profileForm.contactNo,
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                const errorData = await response.text();
                setProfileMessage({ type: 'error', text: errorData || 'Failed to update profile' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setProfileMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoadingProfile(false);
        }
    };

    // Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        // Validation
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoadingPassword(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/${user.userId}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            if (response.ok) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const errorData = await response.text();
                setPasswordMessage({ type: 'error', text: errorData || 'Failed to change password' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="settings-tab">
            {/* Profile Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <FaUser className="section-icon" />
                    <h3>Profile Information</h3>
                </div>

                <form onSubmit={handleProfileSubmit} className="settings-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="fname"
                                value={profileForm.fname}
                                onChange={handleProfileChange}
                                placeholder="First name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input
                                type="text"
                                name="mname"
                                value={profileForm.mname}
                                onChange={handleProfileChange}
                                placeholder="Middle name (optional)"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lname"
                                value={profileForm.lname}
                                onChange={handleProfileChange}
                                placeholder="Last name"
                            />
                        </div>
                        <div className="form-group">
                            <label><FaPhone /> Contact Number</label>
                            <input
                                type="tel"
                                name="contactNo"
                                value={profileForm.contactNo}
                                onChange={handleProfileChange}
                                placeholder="09XX XXX XXXX"
                            />
                        </div>
                    </div>

                    <div className="form-group readonly">
                        <label><FaEnvelope /> Email (cannot be changed)</label>
                        <input
                            type="email"
                            value={user?.email || user?.username || ''}
                            disabled
                        />
                    </div>

                    {profileMessage.text && (
                        <div className={`message ${profileMessage.type}`}>
                            {profileMessage.text}
                        </div>
                    )}

                    <button type="submit" className="btn-save" disabled={loadingProfile}>
                        <FaSave /> {loadingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Password Settings */}
            <div className="settings-section">
                <div className="section-header">
                    <FaLock className="section-icon" />
                    <h3>Change Password</h3>
                </div>

                <form onSubmit={handlePasswordSubmit} className="settings-form">
                    <div className="form-group">
                        <label>Current Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    {passwordMessage.text && (
                        <div className={`message ${passwordMessage.type}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    <button type="submit" className="btn-save" disabled={loadingPassword}>
                        <FaLock /> {loadingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SettingsTab;
