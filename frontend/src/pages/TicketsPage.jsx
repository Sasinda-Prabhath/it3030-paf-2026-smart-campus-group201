const TicketsPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🎫 Ticket Management</h1>
          <p className="text-gray-600 mt-1">Coming soon - Module C</p>
        </div>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <p className="text-6xl mb-4">🎫</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Management System</h2>
            <p className="text-gray-600 mb-6">
              Track and manage maintenance requests and support tickets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="border-l-4 border-purple-500 pl-6 py-4">
              <h3 className="font-bold text-gray-900 mb-2">📋 Expected Features</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Create tickets</li>
                <li>• Track status</li>
                <li>• Assign to staff</li>
                <li>• Comments & updates</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-6 py-4">
              <h3 className="font-bold text-gray-900 mb-2">🎯 Module Details</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Status: In Development</li>
                <li>• Owner: Module C Team</li>
                <li>• Type: Ticket System</li>
                <li>• Priority: High</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
