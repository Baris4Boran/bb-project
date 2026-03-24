"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        setMessage("");
      } else {
        setMessage("Invalid password");
      }
    } catch (error) {
      setMessage("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const setVideo = async (videoName: string) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video: videoName }),
      });
      if (res.ok) {
        setMessage(`Successfully set to ${videoName}`);
      } else {
        setMessage("Failed to set video");
      }
    } catch (error) {
      setMessage("Error setting video");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Login</h1>
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="p-4 rounded bg-gray-800 text-white border border-gray-700 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded font-bold transition-colors disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
          {message && <p className="text-red-400 text-center">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-12">Video Control Admin</h1>

      <div className="flex gap-8">
        <button
          onClick={() => setVideo("myvid1.mp4")}
          disabled={loading}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-xl transition-colors disabled:opacity-50"
        >
          VIDEO 1
        </button>

        <button
          onClick={() => setVideo("myvid2.mp4")}
          disabled={loading}
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-xl transition-colors disabled:opacity-50"
        >
          VIDEO 2
        </button>
      </div>

      {message && <div className="mt-8 text-lg text-gray-300">{message}</div>}
    </div>
  );
}
