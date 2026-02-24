import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaSpinner, FaArrowRight } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Logo from "../images/logo.jpg";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await axios.post(
        `${API_BASE_URL}/signup`,
        formData,
        { withCredentials: true }
      );
      navigate("/"); // go to login after signup
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-30 blur-sm"
        >
          <source src="/Green Modern Grocery Delivery Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-slate-900/40" />
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
              className="mx-auto w-20 h-20 bg-white rounded-full p-1 mb-4 shadow-lg shadow-primary/20"
            >
              <img src={Logo} alt="Expirey Eye" className="w-full h-full object-cover rounded-full" />
            </motion.div>
            <CardTitle className="text-3xl font-heading font-bold text-white mb-1">Create Account</CardTitle>
            <p className="text-slate-400 text-sm">Join the smart grocery revolution.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                icon={<FaUser className="text-slate-400" />}
                placeholder="Username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary"
              />
              <Input
                icon={<FaEnvelope className="text-slate-400" />}
                type="email"
                placeholder="Email Address"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-primary"
              />
              <Input
                icon={<FaLock className="text-slate-400" />}
                type="password"
                placeholder="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
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

              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-600 hover:to-emerald-700 border-0 shadow-lg shadow-primary/30"
                rightIcon={!submitting && <FaArrowRight />}
              >
                {submitting ? <FaSpinner className="animate-spin" /> : "Sign Up"}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link to="/" className="text-white font-semibold hover:underline decoration-primary underline-offset-4">
                    Sign In
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
