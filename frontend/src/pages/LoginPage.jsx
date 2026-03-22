import { useAuth } from '../features/auth/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Smart Campus</h1>
        <p className="mb-6">Please log in with your Google account to continue.</p>
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;