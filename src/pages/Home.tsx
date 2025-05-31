import React from 'react';
import { useUserStore } from '../store/userStore';

const Home: React.FC = () => {
  const { user } = useUserStore();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md p-4 page-container">
      <h1 className="text-2xl font-semibold mb-2">Bienvenido de nuevo</h1>
      <p className="text-gray-600">Has iniciado sesión como <strong>{user?.email}</strong></p>
    </div>
  );
};

export default Home;