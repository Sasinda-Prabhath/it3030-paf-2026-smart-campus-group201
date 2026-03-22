const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resource Management</h1>
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-xl text-gray-700 mb-4">This module is coming soon</p>
          <p className="text-gray-600 mb-8">
            Resource Management functionality including facility booking, inventory management, and resource allocation will be implemented by Module A team.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-left">
            <p className="text-sm text-gray-600">
              <strong>Expected features:</strong>
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
              <li>View available resources</li>
              <li>Reserve resources</li>
              <li>Manage resource inventory</li>
              <li>Track resource utilization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
