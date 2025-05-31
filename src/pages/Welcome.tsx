import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white px-4 ">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
        ¡Bienvenido a DCSystem!
      </h1>
      <p className="mb-8 text-lg max-w-md text-center drop-shadow-md">
        Tu sistema de gestión de inventarios y presupuestos fácil y rápido.
      </p>
      <button
        onClick={() => navigate('/login')}
        className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition"
      >
        Iniciar Sesión
      </button>
    </div>
  );
};

export default Welcome;