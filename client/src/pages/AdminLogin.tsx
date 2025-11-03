import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crown, Lock, User } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      if (data.success && data.admin) {
        toast.success("Login successful!");
        // Store admin session
        localStorage.setItem("adminSession", JSON.stringify({
          adminId: data.admin.id,
          username: data.admin.username,
          loginTime: new Date().toISOString(),
        }));
        setLocation("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || "Login failed");
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    setIsLoading(true);
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full mb-4">
            <Crown className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gold-500 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-400">
            Sheikh Ammar Horology Gallery
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gold-500/30 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-gold-500" />
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-gray-800 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-500"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold-500" />
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-gray-800 border-gold-500/30 text-white placeholder:text-gray-500 focus:border-gold-500"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-bold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-gold-500/50"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Authorized access only</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-gray-400 hover:text-gold-500 transition-colors text-sm"
          >
            ← Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
}
