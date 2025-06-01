import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register( name, email, password );
      navigate("/login");
    } catch (err: any) {
      setError("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="p-6 space-y-4 bg-white rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold">Register</h2>
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
          Register
        </Button>
        <p
          className="text-sm text-center text-blue-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
