import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Área protegida - Dashboard</h1>
    </div>
  );
}
