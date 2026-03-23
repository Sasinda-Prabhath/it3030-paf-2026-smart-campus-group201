import { useAuth } from '../features/auth/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Campus
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features & Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Campus Management,<br /> 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive platform for managing resources, bookings, and facilities across campus.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Booking</h3>
                <p className="text-sm text-gray-600">Reserve venues and resources with ease</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
                <p className="text-sm text-gray-600">Track and manage maintenance tickets</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
                <p className="text-sm text-gray-600">Manage campus inventory efficiently</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔔</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Stay updated on all campus events</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <p className="text-gray-600 text-sm">Users Active</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <p className="text-gray-600 text-sm">Resources</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">24/7</div>
                <p className="text-gray-600 text-sm">Support</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
                  <h3 className="text-white text-3xl font-bold mb-2">Welcome Back</h3>
                  <p className="text-blue-100">Access your campus dashboard</p>
                </div>

                {/* Card Body */}
                <div className="p-8">
                  <div className="mb-8">
                    <p className="text-gray-600 text-center mb-6">
                      Sign in with your institutional Google account to get started.
                    </p>
                  </div>

                  <button
                    onClick={login}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      By signing in, you agree to our{' '}
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Terms of Service
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Cards Below Login */}
              <div className="mt-8 space-y-4">
                <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">🔒</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Secure Login</h4>
                    <p className="text-xs text-gray-600">OAuth2 authentication</p>
                  </div>
                </div>
                <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Fast Access</h4>
                    <p className="text-xs text-gray-600">Instant campus data sync</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600">
          <p className="text-sm">© 2026 Smart Campus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;