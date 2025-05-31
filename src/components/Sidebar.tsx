import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore'; // Importar el store de usuario
import {
  FaHome,
  FaBox,
  FaExchangeAlt,
  FaMoneyBill,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const navItems = [
  { name: 'Inicio', path: '/dashboard', icon: <FaHome /> },
  { name: 'Inventario', path: 'inventory', icon: <FaBox /> },
  { name: 'Presupuestos', path: 'budgets', icon: <FaMoneyBill /> },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { setUser } = useUserStore(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // limpiar sesión
    navigate('/login', { replace: true }); // redirigir al login
  };

  return (
    <>
      {/* Botón hamburguesa solo visible en mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white bg-purple-700 p-2 rounded-full shadow-md hover:bg-purple-800 transition"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <br />
      <div
        className={`fixed md:static top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen w-64 bg-gradient-to-b from-purple-800 via-purple-900 to-gray-900 text-white shadow-lg z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col justify-between h-full w-full">
          {/* Botón de cerrar solo en mobile */}
          <div className="md:hidden flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navegación */}
          <div className="px-4 pt-6 space-y-2 flex-grow">
            {navItems.map(({ name, path, icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-700 text-white font-semibold'
                      : 'text-gray-300 hover:bg-purple-600 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                  <span>{name}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-700 mt-auto">
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-sm py-2 rounded-md shadow-md transition-all duration-200"
            >
              <FaSignOutAlt />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;