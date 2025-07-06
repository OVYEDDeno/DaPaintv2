import React, { useState } from "react";

export const ProfileComponent = ({ 
  showProfile, 
  toggleProfile, 
  currentUser,
  bearerToken,
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || "Current User",
    email: currentUser?.email || "user@example.com",
    phone: currentUser?.phone || "",
    zipcode: currentUser?.zipcode || "",
    bio: currentUser?.bio || "",
    favoritesSports: currentUser?.favoritesSports || [],
    avatar: currentUser?.avatar || "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sports = [
    "Basketball", "Football", "Soccer", "Tennis", "Baseball", 
    "Swimming", "Boxing", "MMA", "Golf", "Track & Field",
    "Volleyball", "Hockey", "Wrestling", "Gymnastics", "Cycling"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSportToggle = (sport) => {
    setProfileData(prev => ({
      ...prev,
      favoritesSports: prev.favoritesSports.includes(sport)
        ? prev.favoritesSports.filter(s => s !== sport)
        : [...prev.favoritesSports, sport]
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In real app, upload to cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // In real app, send to API
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        if (onProfileUpdate) {
          onProfileUpdate(profileData);
        }
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  if (!showProfile) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button 
          className="back-btn" 
          onClick={toggleProfile}
          title="Back"
        >
          ←
        </button>
        <h2>Profile</h2>
        <button 
          className="edit-btn"
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? "Cancel" : "Edit Profile"}
        >
          {isEditing ? "✕" : "✏️"}
        </button>
      </div>

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <img 
              src={profileData.avatar} 
              alt="Profile"
              className="profile-avatar"
            />
            {isEditing && (
              <label className="avatar-upload">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  hidden
                />
                📷
              </label>
            )}
          </div>
          <h3>{profileData.name}</h3>
        </div>

        {/* Messages */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipcode"
              value={profileData.zipcode}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="12345"
              maxLength="5"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Tell us about yourself..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Favorite Sports</label>
            <div className="sports-grid">
              {sports.map(sport => (
                <button
                  key={sport}
                  type="button"
                  className={`sport-tag ${profileData.favoritesSports.includes(sport) ? 'selected' : ''}`}
                  onClick={() => isEditing && handleSportToggle(sport)}
                  disabled={!isEditing}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          {isEditing && (
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form>

        {/* Stats Section */}
        <div className="stats-section">
          <h4>Your Stats</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">7</span>
              <span className="stat-label">Current Streak</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">23</span>
              <span className="stat-label">Total Wins</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">8</span>
              <span className="stat-label">Total Losses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">$450</span>
              <span className="stat-label">Earnings</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 1000;
          overflow-y: auto;
          padding-bottom: 80px; /* Account for bottom nav */
        }

        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .profile-header h2 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }

        .back-btn, .edit-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #333;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .back-btn:hover, .edit-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .profile-content {
          padding: 20px;
        }

        .avatar-section {
          text-align: center;
          margin-bottom: 30px;
        }

        .avatar-container {
          position: relative;
          display: inline-block;
          margin-bottom: 15px;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #ffd700;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .avatar-upload {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #ffd700;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .avatar-upload:hover {
          background: #ffed4e;
        }

        .avatar-section h3 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .profile-form {
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ffd700;
        }

        .form-group input:disabled,
        .form-group textarea:disabled {
          background: #f8f9fa;
          color: #666;
        }

        .sports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .sport-tag {
          padding: 8px 12px;
          border: 2px solid #eee;
          border-radius: 20px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 12px;
          font-weight: 500;
        }

        .sport-tag:hover:not(:disabled) {
          border-color: #ffd700;
        }

        .sport-tag.selected {
          background: #ffd700;
          border-color: #ffd700;
          color: #333;
        }

        .sport-tag:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .save-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .save-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
          transform: translateY(-2px);
        }

        .save-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .stats-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
        }

        .stats-section h4 {
          margin: 0 0 20px 0;
          color: #333;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .stat-item {
          text-align: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #ffd700;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .alert {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        @media (max-width: 768px) {
          .profile-content {
            padding: 15px;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
          }

          .avatar-upload {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }

          .sports-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 8px;
          }

          .sport-tag {
            padding: 6px 10px;
            font-size: 11px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .profile-header {
            padding: 15px;
          }

          .profile-content {
            padding: 12px;
          }

          .avatar-section h3 {
            font-size: 20px;
          }

          .sports-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};