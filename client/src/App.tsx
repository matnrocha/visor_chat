import { Button } from "./components/ui/button";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50">
      <h1 className="text-3xl font-bold">Bem-vindo ao App</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/register">Registrar</Link>
        </Button>
      </div>
    </div>
  );
}
