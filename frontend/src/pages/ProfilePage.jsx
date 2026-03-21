import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getProfile, updateProfile, sendVerificationEmail } from '../api/profileApi';
import { User, Mail, Shield, CheckCircle, AlertTriangle, Save, Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, checkAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      if (res.data.success) {
        setProfile(res.data.data);
        setFormData({ fullName: res.data.data.fullName });
      }
    } catch(e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ text: '', type: '' });
    try {
      await updateProfile(formData);
      setMsg({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      loadProfile();
      checkAuth(); // refresh global state
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await sendVerificationEmail();
      setMsg({ text: 'Verification email sent! Please check your inbox.', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to send email', type: 'error' });
    } finally {
      setVerifying(false);
    }
  };

  if (!profile) return <div className="animate-pulse flex p-8 bg-white rounded-xl h-64 justify-center items-center text-gray-400 font-medium">Loading profile data...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="text-brand-600" /> My Profile
        </h1>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {msg.text}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={profile.profileImageUrl || 'https://via.placeholder.com/128'} 
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white ring-1 ring-gray-100" 
            alt="Profile"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 right-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
            {profile.role}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{profile.fullName}</h2>
          <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail className="w-4 h-4" /> {profile.email}
          </p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-gray-50 mt-2">
            {profile.emailVerified ? (
              <><span className="w-2 h-2 rounded-full bg-green-500"></span> <span className="text-green-700">Verified Account</span></>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-amber-500"></span> <span className="text-amber-700">Unverified Email</span></>
            )}
          </div>
        </div>
      </div>

      {/* Details & Edit */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Account Details</h3>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-sm text-brand-600 hover:text-brand-800 font-medium">
              Edit Name
            </button>
          )}
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName} 
                  onChange={e => setFormData({fullName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow outline-none"
                  required 
                  minLength={2}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-base text-gray-900">{profile.fullName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                <dd className="mt-1 text-base text-gray-900">{profile.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">System Role</dt>
                <dd className="mt-1 flex items-center gap-1.5 focus">
                  <Shield className={`w-4 h-4 ${profile.role === 'ADMIN' ? 'text-red-500' : 'text-blue-500'}`} />
                  <span className="font-semibold text-gray-800">{profile.role}</span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Joined Date</dt>
                <dd className="mt-1 text-base text-gray-900">
                  {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </dd>
              </div>
            </dl>
          )}

          {!profile.emailVerified && !isEditing && (
            <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-semibold text-orange-800">Verify your email address</h4>
                <p className="text-sm text-orange-700 mt-1">To access all features and receive campus updates, please verify.</p>
              </div>
              <button 
                onClick={handleVerify} 
                disabled={verifying}
                className="whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} 
                Send Link
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
