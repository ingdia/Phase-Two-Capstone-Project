"use client"
import { useState } from 'react'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
try {
      setLoading(true);
      setError(null);

      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("Registration successful!");
      router.push("/login");
    } catch (error) {
      setError("Failed to register user");
    } finally {
      setLoading(false);
    }
  }

 

  return (
<div className='bg-white min-h-screen pt-10'>
        <div className=' text-gray-300 space-x-2 font-serif p-2  flex items-center justify-center'>
      <div className=' shadow-lg shadow-gray-700 py-6 bg-black  p-14 flex flex-col md:flex-row gap-4 rounded-md'>
       {/* <h1 className='text-2xl font-bold'>Register</h1> */}
       
        <div className='flex flex-col text-gray-300 justify-center items-center md:items-start text-center md:text-left  gap-4 p-4'>
          <h1 className='text-4xl font-bold text-white  '>welcome!</h1>
          <h4>Take Control of Your Day</h4>
          <div>
            <p className='text-sm'>Join us today and start organizing your tasks efficiently.</p>
           <p>Sign up and take control of your day!</p>
          <p>Join thousands of users boosting their productivity every day.</p>
          
          </div>
        </div>
        <form className='flex flex-col justify-center items-center  bg-gray-200/10 p-10 ' onSubmit={handleSubmit} >
          <h1 className='font-semibold text-2xl '>Sign Up</h1>
          <input type="name" placeholder='your name' id='email' className='p-2 m-2 text-white  w-70 rounded-full bg-gray-300/20'  onChange={(e) => setName(e.target.value)} required/>
          <input type="email" placeholder='Email' className='p-2 m-2  text-white  w-70 rounded-full bg-gray-300/20' onChange={(e)=> setEmail(e.target.value)}  required/>
          <input type="username" placeholder='Username' className='p-2 m-2  text-white  w-70 rounded-full bg-gray-300/20' onChange={(e) => setUsername(e.target.value)}  required/>
          <input type="password" placeholder='Password' className='p-2 m-2  text-white  w-70 rounded-full bg-gray-300/20'  onChange={(e) => setPassword(e.target.value)}required/>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type='submit' className='bg-white text-amber-950 px-20 p-2 m-2 rounded-full font-bold hover:bg-gray-200 ' disabled={loading}   > {loading ? "Registering..." : "Register"}</button>
          <Link href="/login" className='text-sm text-white hover:underline'>Already have an account? Log In</Link>
        </form>
    </div>
    </div>
</div>
  )
}

export default Page