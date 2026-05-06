import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaSpinner, FaArrowRight } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Logo from "../images/logo.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // If already authenticated, skip login page
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40 blur-sm"
        >
          <source src="/Green Modern Grocery Delivery Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "out" }}
        className="relative z-10 w-full max-w-md p-4"
      >
            <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto w-24 h-24 bg-white rounded-full p-1 mb-4 shadow-lg shadow-primary/20"
                >
                  <img src={Logo} alt="Expirey Eye" className="w-full h-full object-cover rounded-full" />
                </motion.div>
                <CardTitle className="text-3xl font-heading font-bold text-white mb-1">Welcome Back</CardTitle>
                <p className="text-slate-400 text-sm">Sign in to manage your smart grocery store.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    icon={<FaUser className="text-slate-400" />}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary"
                  />
                  <Input
                    icon={<FaLock className="text-slate-400" />}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary"
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-xs text-center bg-red-900/20 py-2 rounded border border-red-900/30"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="flex justify-end">
                    <Link to="/signup" className="text-xs text-primary hover:text-primary-400 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-600 hover:to-emerald-700 border-0 shadow-lg shadow-primary/30"
                    rightIcon={!submitting && <FaArrowRight />}
                  >
                    {submitting ? <FaSpinner className="animate-spin" /> : "Sign In"}
                  </Button>

                  <div className="pt-4 text-center">
                    <p className="text-slate-400 text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-white font-semibold hover:underline decoration-primary underline-offset-4">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
    </div>
  );
}
