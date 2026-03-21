import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notificationApi';
import { Bell, CheckCheck, Trash2, Info, FileWarning, Inbox } from 'lucide-react';

const NotificationsPage = () => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    try {
      const res = await getNotifications();
      if (res.data.success) setNotifs(res.data.data);
    } catch(e) {} finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    await markAsRead(id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifs(prev => prev.filter(n => n.id !== id));
  };

  if (loading) return <div className="p-8 text-center text-gray-500 flex items-center justify-center h-64">Loading notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="text-brand-600" /> Notifications
        </h1>
        {notifs.length > 0 && notifs.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition transition-shadow hover:shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-brand-600" /> Read All
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Inbox className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-medium text-gray-600">All caught up!</p>
            <p className="text-sm mt-1">You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifs.map(n => (
              <div 
                key={n.id} 
                className={`p-6 flex gap-4 transition-colors hover:bg-gray-50 ${!n.isRead ? 'bg-brand-50/20 relative' : ''}`}
              >
                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>}
                
                <div className={`flex-shrink-0 mt-1 rounded-xl p-3 h-12 w-12 flex items-center justify-center ${!n.isRead ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>
                  {n.type === 'SYSTEM' || n.type === 'PROFILE_VERIFICATION' ? <Info className="w-6 h-6" /> : <FileWarning className="w-6 h-6" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className={`text-base tracking-tight ${!n.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                        {n.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">{n.message}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap font-medium bg-gray-50 px-2 py-1 rounded">
                      {new Date(n.createdAt).toLocaleDateString(undefined, {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-3">
                    {!n.isRead && (
                      <button 
                        onClick={() => handleMarkRead(n.id)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-800 transition"
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(n.id)}
                      className="text-sm font-medium text-gray-400 hover:text-red-500 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;
