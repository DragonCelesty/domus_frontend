import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <main className="pt-16 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;