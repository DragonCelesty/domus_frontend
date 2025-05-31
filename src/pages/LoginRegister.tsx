import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Assuming react-router-dom is used for navigation
import { RoundedInput } from "../components/ui/RoudedInput";
import { Button } from "../components/ui/Button";

export function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error, setAuthData } = useAuth(); 
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const authData = await register(email, password); // Register returns authentication data
      setAuthData(authData); // Store authentication data for protected routes
      navigate("/dashboard"); // Redirect to the dashboard
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-200 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Registro</h2>
        <div className="mb-4">
          <RoundedInput
            type="email"
            placeholder="Email"
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
          {error && <div className="text-red-500 mb-2">{error}</div>}

          <div className="flex justify-center">
            <Button onClick={handleRegister} disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
