import { useAuth } from '../features/auth/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Smart Campus Management System</h1>
      {user ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl mb-2">Welcome, {user.fullName}!</h2>
          <p className="mb-2">Email: {user.email}</p>
          <p className="mb-2">Role: {user.role}</p>
          {user.userType && <p className="mb-2">User Type: {user.userType}</p>}
          {user.staffType && <p className="mb-2">Staff Type: {user.staffType}</p>}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Please log in to access the system.</p>
      )}
    </div>
  );
};

export default HomePage;