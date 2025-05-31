import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { LoginRegister } from './pages/LoginRegister';
import Welcome from './pages/Welcome';
import DashboardLayout from './pages/DashboarLayout';
import Home from './pages/Home';
import { useUserStore } from './store/userStore';
import Inventory from './pages/Inventory';
import PrivateRoute from './components/PrivateRouter';
import BudgetsPage from './pages/Budget';
import React from 'react';

export const App = () => {
  const { session } = useUserStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Aquí podrías simular la carga de sesión (ejemplo)
    // Ojalá uses tu efecto que chequea supabase o token en localStorage
    if (session !== undefined) setLoading(false);
  }, [session]);

  if (loading) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<LoginRegister />} />

        {/* Aquí envolvemos todo dashboard en PrivateRoute */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }>
          <Route index element={<Home />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="budgets" element={<BudgetsPage />} />
        </Route>

        {/* Ruta catch-all para redirigir a login si no autenticado */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};