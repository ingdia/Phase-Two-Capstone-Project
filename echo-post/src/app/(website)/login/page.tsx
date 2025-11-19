"use client"
import { useState } from 'react'
import Link from 'next/link'
import React from 'react'

import { useRouter } from 'next/navigation'

function Page() {
//   const router = useRouter();
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     try {
//       setLoading(true);
//       setError(null);
//        await register(email, password);
//        alert(" Registration successful!");
//        router.push("/login");
//     }
//     catch (error: unknown) {
//       setError("Failed to register user");
//     }
//     finally {
//       setLoading(false);
//     }
   
//   }
 

  return (
<div className='bg-pink-100 min-h-screen pt-10'>
        <div className=' text-gray-300 space-x-2 font-serif p-2  flex items-center justify-center'>
      <div className=' shadow-lg shadow-gray-700 py-20 bg-pink-900/90  p-14 flex flex-col md:flex-row gap-4 rounded-md'>
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
        <form className='flex flex-col justify-center items-center  bg-gray-200/10 p-10 '  >
          <h1 className='font-semibold text-2xl '>Sign In</h1>
          <input type="email" placeholder='Email' id='email' className='p-2 m-2 text-white  w-70 rounded-full bg-gray-300/20'  required/>
          <input type="password" placeholder='Password' className='p-2 m-2  text-white  w-70 rounded-full bg-gray-300/20'  required/>
          <button type='submit' className='bg-white text-amber-950 px-20 p-2 m-2 rounded-full font-bold hover:bg-gray-200' >LogIn</button>
          <Link href="/register" className='text-sm text-white hover:underline'>Already have an account? Log In</Link>
        </form>
    </div>
    </div>
</div>
  )
}

export default Page