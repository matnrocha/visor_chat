/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Invalid credentials");
    }
  };

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-6 space-y-4 bg-white rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold">Login</h2>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
        <p
          className="text-sm text-center text-blue-500 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </p>
      </form>
    </div>
  );
}
