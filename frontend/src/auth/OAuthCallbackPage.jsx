import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Handle the redirect after successful Google OAuth2 login.
 * The backend sets an HttpOnly cookie, so we just need to re-fetch the user details
 * and redirect to the dashboard.
 */
export const OAuthCallbackPage = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth to see if the cookie works and user is available
    checkAuth().then(() => {
      navigate('/');
    });
  }, [checkAuth, navigate]);

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600 mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700">Verifying authentication...</h2>
    </div>
  );
};
