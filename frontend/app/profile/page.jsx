'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [attemptedQuestions, setAttemptedQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo) {
          setError('User not authenticated. Please log in.');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        };

        const { data: profile } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, config);
        setProfileData(profile);

        const { data: answers } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/userAnswers`,config);

        setAttemptedQuestions(answers);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to fetch profile data.');
      }
    };

    fetchProfileData();
  }, []);

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-sky-600">
        <Navbar />
        <div className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 border-4 border-t-4 border-white border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="text-white text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-600">
    <Navbar />
    <div className="container mx-auto mt-5 p-4">
      <div className="flex flex-col items-center border-b border-gray-700 pb-4 mb-4 space-y-5">
          <h1 className="text-4xl font-bold mb-1 text-white">{profileData.name}</h1>
          <p className="text-xl text-white mb-4">{profileData.email}</p>
          <p className="text-xl text-white mb-4">Semester: {profileData.semester}</p>
          <p className="text-xl text-white mb-4">{profileData.phoneNo}</p>
          <p className="text-xl text-white mb-4">{profileData.enrollmentNo}</p>
          <p className="text-xl text-white mb-4">Total Attempted Questions: {attemptedQuestions.length}</p>


      

          {/* Attempted Questions Section */}
          {/* {attemptedQuestions.length > 0 ? (
            <div className="bg-white text-gray-900 p-4 rounded-md w-full">
              <h3 className="text-lg font-semibold text-black mb-2">Attempted Questions</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Answer</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
  {attemptedQuestions.map((question, index) => (
    <tr key={index}>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-black">{question.question || 'N/A'}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-black">{question.selectedOption || 'N/A'}</span>
      </td>
   
    </tr>
  ))}
</tbody>

              </table>
            </div>
          ) : (
            <div className="mt-4 text-center text-white">
              No questions attempted yet
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
