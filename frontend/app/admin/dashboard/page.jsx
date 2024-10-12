import React from 'react';
import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link 
          href="/admin/addChallenge" 
          className="px-6 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 text-center"
        >
          Add Challenge
        </Link>
        <Link 
          href="/admin/contestTimes" 
          className="px-6 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors duration-300 text-center"
        >
          Change Time
        </Link>
        <Link 
          href="/admin/scoreboard" 
          className="px-6 py-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300 text-center"
        >
          View Scoreboard
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
