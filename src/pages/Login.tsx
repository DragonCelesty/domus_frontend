import React, { useState } from "react";
import { useUserStore } from "../store/userStore";
import { supabase } from "../lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { RoundedInput } from "../components/ui/RoudedInput";
import { Button } from "../components/ui/Button";

const Login: React.FC = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const user: User | null = data.user ?? null;
      setUser(user);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Iniciar sesión
        </h2>
        <div className="mb-4">
          <RoundedInput
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <RoundedInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
        </div>
        <div className="text-sm text-center text-gray-600">
          <Button
            variant="primary"
            size="large"
            onClick={handleLogin}
            disabled={loading}
            className="mt-4 "
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </Button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>

        <div className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?
          <br />
          <Button
            variant="secondary"
            size="small"
            onClick={() => navigate("/register")}
            className="mt-2"
          >
            Registrarse
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
