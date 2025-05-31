import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login  from './pages/Login';
import { LoginRegister } from './pages/LoginRegister';
import Welcome from './pages/Welcome';
import DashboardLayout from './pages/DashboarLayout';
import Home from './pages/Home';
import { useUserStore } from './store/userStore';
import Inventory from './pages/Inventory';
import PrivateRoute from './components/PrivateRouter';  
import BudgetsPage from './pages/Budget';


export const App = () => {
  const { user } = useUserStore();
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<LoginRegister />} />
         {/* Dashboard con rutas protegidas */}
         {user ? (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route
              path="inventory"
              element={
                <PrivateRoute>
                  <Inventory />
                </PrivateRoute>
              }
            />
            <Route
              path="budgets"
              element={
                <PrivateRoute>
                  <BudgetsPage />
                </PrivateRoute>
              }
            />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};