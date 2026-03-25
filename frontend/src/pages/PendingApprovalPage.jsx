import React from 'react';
import { useAuth } from '../features/auth/AuthContext';

const PendingApprovalPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Account Pending Approval</h1>
                <p className="text-gray-600 mb-6">
                    Welcome, <span className="font-semibold">{user?.fullName || user?.email}</span>!
                </p>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6">
                    <p>Your account has been created but is currently awaiting approval from a system administrator. You will have limited access until your account is approved.</p>
                </div>
                <p className="text-gray-600 mb-8">
                    Once an administrator reviews and approves your account, you will gain full access to the Smart Campus application.
                </p>
                <button
                    onClick={logout}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
