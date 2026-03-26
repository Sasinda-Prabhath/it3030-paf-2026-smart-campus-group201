import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { profileApi } from '../api/profile';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', profileImageUrl: '' });
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data);
      setImageError(false);
      setFormData({
        fullName: response.data.fullName || '',
        profileImageUrl: response.data.profileImageUrl || '',
      });
    } catch (error) {
      console.error('Failed to load profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await profileApi.updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile 👤</h1>
          <p className="text-gray-600 mt-1">Manage your account and personal information</p>
        </div>

        {profile && (
          <div className="bg-white rounded-lg shadow">
            {!editing ? (
              <>
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white relative">
                  <div className="absolute right-8 top-8">
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-white bg-opacity-25 hover:bg-opacity-40 px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      ✏️ Edit Profile
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
                      {profile.profileImageUrl && !imageError ? (
                        <img
                          src={profile.profileImageUrl}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={() => setImageError(true)}
                          onLoad={() => setImageError(false)}
                        />
                      ) : (
                        <span className="text-4xl">👤</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-1">{profile.fullName}</h2>
                      <p className="text-blue-100">{profile.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Information Grid */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Full Name */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.fullName}</p>
                    </div>

                    {/* Email */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                    </div>

                    {/* Role */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Role</p>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {profile.role}
                      </span>
                    </div>

                    {/* User Type */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">User Type</p>
                      <p className="text-lg font-semibold text-gray-900">{profile.userType || 'N/A'}</p>
                    </div>

                    {/* Staff Type */}
                    {profile.staffType && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">Staff Type</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.staffType}</p>
                      </div>
                    )}

                    {/* Account Status */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Account Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        profile.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        profile.accountStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {profile.accountStatus || 'ACTIVE'}
                      </span>
                    </div>

                    {/* Email Verified */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Email Verified</p>
                      <span className={`text-lg font-semibold ${profile.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {profile.emailVerified ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Edit Form */}
                <div className="bg-gray-50 p-8 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Edit Profile</h3>
                  <p className="text-gray-600">Update your profile information</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Profile Image URL</label>
                    <input
                      type="url"
                      name="profileImageUrl"
                      value={formData.profileImageUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-2">Leave empty to use default avatar</p>
                  </div>

                  {formData.profileImageUrl && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">Preview</p>
                      <img
                        src={formData.profileImageUrl}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          console.warn('Failed to load image:', formData.profileImageUrl);
                        }}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;