import { useAuth } from '../auth/AuthProvider';
import { BookOpen, Users, Calendar, Ticket, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActionCard = ({ title, desc, icon: Icon, color, to }) => (
  <Link to={to} className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md hover:border-brand-200 transition-all cursor-pointer ring-1 ring-black/5">
    <div className={`p-3 rounded-lg flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors flex items-center gap-2">
        {title}
        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  </Link>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-brand-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-5"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
            <p className="text-brand-100 max-w-xl">
              {user?.role === 'ADMIN' 
                ? "You have system administrator access. Oversee users and manage campus configurations below."
                : "Your central hub for campus facilities, help desk requests, and profile management."}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex items-center gap-4">
            <img 
              src={user?.profileImageUrl || 'https://via.placeholder.com/64'} 
              className="w-12 h-12 rounded-full border-2 border-white/50" 
              alt="Profile"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-medium text-white">{user?.fullName}</p>
              <p className="text-xs text-brand-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <ActionCard 
          title="My Profile" 
          desc="Manage your personal details and verify your email"
          icon={User}
          color="bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
          to="/profile"
        />

        <ActionCard 
          title="Campus Bookings" 
          desc="Reserve lecture halls, labs, and sports facilities"
          icon={Calendar}
          color="bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
          to="#"
        />
        
        <ActionCard 
          title="Help Desk Tickets" 
          desc="Submit IT, maintenance, or administrative queries"
          icon={Ticket}
          color="bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
          to="#"
        />

        <ActionCard 
          title="Course Materials" 
          desc="Access your enrolled modules and lecture notes"
          icon={BookOpen}
          color="bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
          to="#"
        />

        {user?.role === 'ADMIN' && (
          <ActionCard 
            title="User Management" 
            desc="System administrators only. Manage roles and access"
            icon={Users}
            color="bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white"
            to="/admin/users"
          />
        )}
      </div>

      {/* Notice Board Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          Campus Announcements
        </h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded">Update</span>
            <p className="text-sm text-gray-800 mt-2 font-medium">New Campus Booking System Launching Soon</p>
            <p className="text-xs text-gray-500 mt-1">Get ready to reserve facilities seamlessly through this portal next month.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
