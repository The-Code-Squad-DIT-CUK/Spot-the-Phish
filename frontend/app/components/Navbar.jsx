'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../public/images/logo2.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    router.push('/'); // Redirect to home page
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (isLoggedIn) {
      router.push(path); // Navigate to the actual page
    } else {
      router.push('/login'); // Redirect to login page
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    setIsLoggedIn(!!userInfo);
  }, []);

  return (
    <nav className="bg-sky-700 p-4 fixed w-full z-10 top-0 border-b-2 border-white">
      <div className="container mx-auto flex justify-between items-center text-lg">
        <Link href="/">
          <Image src={logo} alt="CTF Logo" className="w-16 h-auto mx-7" />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
        <div className="hidden md:flex items-center space-x-3">
          <a href="#" onClick={(e) => handleNavigation(e, '/users')} className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">Users</a>
          <a href="#" onClick={(e) => handleNavigation(e, '/challenges')} className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">Challenges</a>
        </div>
        <div className="hidden md:flex items-center space-x-4 ml-auto mr-5">
          {isLoggedIn ? (
            <div className="flex space-x-3">
            
              <Link href="/profile" className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">
                Profile
              </Link>
            
              <button onClick={handleLogout} className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-3 flex text-lg">
              <Link href="/register" className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">
                Register
              </Link>
              <Link href="/login" className="text-white px-4 py-2 rounded-full transition-transform duration-200 hover:bg-white hover:text-black hover:scale-105">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className={`md:hidden fixed top-0 left-0 w-full h-full bg-black z-20 flex flex-col items-center justify-center transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col items-center space-y-4">
          <a href="#" onClick={(e) => handleNavigation(e, '/users')} className="text-white px-4 py-2">Users</a>
          <a href="#" onClick={(e) => handleNavigation(e, '/challenges')} className="text-white px-4 py-2">Challenges</a>
          {isLoggedIn ? (
            <>
             
              <Link href="/profile" className="text-white p-2" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
             
              <button onClick={handleLogout} className="text-white p-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-white p-2" onClick={() => setIsOpen(false)}>
                Register
              </Link>
              <Link href="/login" className="text-white p-2" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
