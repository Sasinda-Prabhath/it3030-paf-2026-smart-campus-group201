const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Management</h1>
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
            <span className="text-3xl">📅</span>
          </div>
          <p className="text-xl text-gray-700 mb-4">This module is coming soon</p>
          <p className="text-gray-600 mb-8">
            Booking Management functionality for venue reservations, room scheduling, and facility access control will be implemented by Module B team.
          </p>
          <div className="bg-green-50 border-l-4 border-green-500 p-4 text-left">
            <p className="text-sm text-gray-600">
              <strong>Expected features:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>View available venues and rooms</li>
              <li>Create and manage bookings</li>
              <li>Check booking history</li>
              <li>Receive booking confirmations</li>
              <li>Calendar integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
