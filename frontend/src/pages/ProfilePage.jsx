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

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileApi.getProfile();
      setProfile(response.data);
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

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {profile && (
        <div className="bg-white p-6 rounded shadow">
          <div className="mb-4">
            {profile.profileImageUrl && (
              <img
                src={profile.profileImageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            )}
          </div>

          {!editing ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Type</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.userType || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Staff Type</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.staffType || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Verified</label>
                  <p className="mt-1 text-sm text-gray-900">{profile.emailVerified ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                <input
                  type="url"
                  name="profileImageUrl"
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;