import { useState, useEffect } from 'react';
import { notificationApi } from '../api/notification';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Mark All as Read
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-4 rounded shadow ${!notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{notification.title}</h2>
                  <p className="text-gray-700 mt-2">{notification.message}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span className="mr-4">Type: {notification.type}</span>
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;