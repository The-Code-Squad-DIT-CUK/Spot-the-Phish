"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { email, password },
        config
      );

      if (data) {
        localStorage.setItem("userInfo", JSON.stringify(data));
    
          router.push('/challenges');
        
      } else {
        setError('Invalid credentials. Please try again.');
      }

    } catch (error) {
      setError('Invalid email or password.');
      console.log(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-600">
      <Navbar />
      <h1 className="text-3xl font-bold text-white mb-6 mt-4">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="border border-white p-8 rounded shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
            value={password}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full border border-white text-white px-4 py-2 mt-7 rounded-full hover:bg-white hover:text-black focus:outline-none relative flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-t-4 border-blue-800 border-solid rounded-full border-t-transparent animate-spin"></div>
            ) : (
              'Submit'
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default Login;
