"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function Page() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setLoading(true);

      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.user, data.token);

      alert("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen pt-10'>
      <div className='text-gray-300 font-serif p-2 flex items-center justify-center'>
        <div className='shadow-lg shadow-gray-700 py-20 bg-black p-14 flex flex-col md:flex-row gap-4 rounded-md'>

          {/* LEFT SIDE TEXT */}
          <div className='flex flex-col text-gray-300 justify-center items-center md:items-start text-center md:text-left gap-4 p-4'>
            <h1 className='text-4xl font-bold text-white'>Welcome Back!</h1>
            <h4>Your Tasks Are Waiting</h4>
            <p className='text-sm'>Sign in to continue organizing your day.</p>
          </div>

          {/* LOGIN FORM */}
          <form 
            className='flex flex-col justify-center items-center bg-gray-200/10 p-10' 
            onSubmit={handleSubmit}
          >
            <h1 className='font-semibold text-2xl'>Sign In</h1>

            <input 
              type="email" 
              placeholder='Email'
              className='p-2 m-2 text-white w-70 rounded-full bg-gray-300/20'
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input 
              type="password" 
              placeholder='Password'
              className='p-2 m-2 text-white w-70 rounded-full bg-gray-300/20'
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button 
              type='submit' 
              className='bg-white text-amber-950 px-20 p-2 m-2 rounded-full font-bold hover:bg-gray-200'
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <Link href="/register" className='text-sm text-white hover:underline'>
              Don’t have an account? Register
            </Link>
          </form>

        </div>
      </div>
    </div>
  );
}

export default Page;
