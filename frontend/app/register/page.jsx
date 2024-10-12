"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Register = () => {
  const [name, setName] = useState('');
  const [semester, setSemester] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        { name, email, password, semester, phoneNo, enrollmentNo },
        config
      );

      if (data) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        router.push('/challenges');
      } else {
        setError('Registration failed. Please try again.');
      }

    } catch (error) {
      setError('Registration failed. Please check your details and try again.');
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sky-600">
      <Navbar />
      <h1 className="text-3xl font-bold text-white mb-10 mt-32">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleRegister} className="border border-white p-8 rounded shadow-md w-full max-w-md mb-10">
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
            User Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
            value={name}
            placeholder='Enter your Username'
            onChange={(e) => setName(e.target.value)}
          />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Semester
            </label>
            <input
              type="text"
              id="semester"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={semester}
              placeholder='Enter your Semester'
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Enrollment No.
            </label>
            <input
              type="text"
              id="enrollmentNo"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={enrollmentNo}
              placeholder='Enter your Enrollment No.'
              onChange={(e) => setEnrollmentNo(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
              Mobile No.
            </label>
            <input
              type="text"
              id="phoneNo"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={phoneNo}
              placeholder='Enter your Mobile No.'
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border text-black border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={email}
              placeholder='Enter your Email'
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
              placeholder='Enter your Password'
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

export default Register;
