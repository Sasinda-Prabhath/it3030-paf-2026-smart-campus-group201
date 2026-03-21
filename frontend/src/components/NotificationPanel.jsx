import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notificationApi';
import { Check, CheckCheck, Trash2, Info, FileWarning, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationPanel = ({ onClose, refreshCount }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifs(); }, []);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      if (res.data.success) setNotifs(res.data.data);
    } catch(e) {} finally { setLoading(false); }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      refreshCount();
    } catch(e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      refreshCount();
    } catch(e) {}
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifs(prev => prev.filter(n => n.id !== id));
      refreshCount();
    } catch(e) {}
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMarkAllRead}
            disabled={!notifs.some(n => !n.isRead)}
            className="text-xs text-brand-600 hover:text-brand-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" /> Mark all read
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px]">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : notifs.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-400">
            <Inbox className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">You have no notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifs.map(n => (
              <div 
                key={n.id} 
                className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50/80 ${!n.isRead ? 'bg-brand-50/30' : ''}`}
              >
                <div className={`mt-0.5 rounded-full p-2 ${!n.isRead ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'}`}>
                  {n.type === 'SYSTEM' || n.type === 'PROFILE_VERIFICATION' ? <Info className="w-4 h-4" /> : <FileWarning className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm tracking-tight ${!n.isRead ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {new Date(n.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {!n.isRead && (
                    <button onClick={() => handleMarkRead(n.id)} className="text-gray-400 hover:text-brand-600 tooltip" title="Mark as read">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-500" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
        <Link 
          to="/notifications" 
          onClick={onClose}
          className="text-sm text-brand-600 hover:text-brand-800 font-medium block py-1"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
