import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import logo from "../assets/logo.jpg";
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await authService.register(name, email, password);
      await authService.login(email, password);
      navigate("/chat");
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="flex-col items-center justify-center hidden w-64 p-8 bg-white border-r border-gray-200 md:flex">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={logo} className="rounded-full" />
        </Avatar>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Visor Chat</h1>
        <p className="text-center text-gray-600">
          AI-powered conversations for your business
        </p>
      </div>

      {/* Main registration area */}
      <main className="flex items-center justify-center flex-1 p-8">
        <Card className="w-full max-w-md bg-white shadow-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4 md:hidden">
              <Avatar className="w-16 h-16">
                <AvatarImage src={logo} className="rounded-full" />
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-center text-gray-800">
              Create an account
            </CardTitle>
            <p className="text-sm text-center text-gray-500">
              Enter your details to get started
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-visible:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus-visible:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-sm text-center text-red-500">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            <div className="mt-4 text-sm text-center text-gray-500">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={handleLoginRedirect}
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Login
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}