import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../api/adminApi';
import { Users, ShieldCheck, Mail, Calendar, Loader2 } from 'lucide-react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.data.success) setUsers(res.data.data);
    } catch(e) {} finally { setLoading(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    setUpdating(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch(e) {
      alert(e.response?.data?.error || 'Role update failed');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium h-64 flex items-center justify-center">Loading users...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-brand-600" /> User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage system access and review registered accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img 
                        src={u.profileImageUrl || 'https://via.placeholder.com/40'} 
                        className="w-10 h-10 rounded-full border border-gray-200"
                        alt="" 
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{u.fullName}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5" title={u.id}>{u.id.split('-')[0]}...</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" /> {u.email}
                    </div>
                    <div className="mt-1">
                      {u.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Unverified
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {u.role === 'ADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {u.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {updating === u.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-brand-500 ml-auto" />
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-white border border-gray-300 text-gray-700 text-xs rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full p-2 outline-none shadow-sm cursor-pointer hover:border-brand-300 transition-colors"
                      >
                        <option value="USER">Make USER</option>
                        <option value="ADMIN">Make ADMIN</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminUsersPage;
