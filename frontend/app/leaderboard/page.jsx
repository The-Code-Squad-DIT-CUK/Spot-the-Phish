'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Leaderboard() {
    const [topUsers, setTopUsers] = useState([]);

    useEffect(() => {
        const fetchTopUsers = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/usersWithCorrectAnswers`);
                const sortedUsers = response.data.sort((a, b) => b.correct - a.correct);
                setTopUsers(sortedUsers); // Get top 3 users
            } catch (error) {
                console.error('Error fetching top users:', error.message);
            }
        };

        fetchTopUsers();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b bg-sky-600 text-white">
            {/* Leaderboard Heading */}
            <h1 className="text-6xl font-extrabold mb-12 text-white tracking-widest uppercase shadow-lg mt-10">
            Spot the Phish
            </h1>
             {/* Event Name */}
             <div className="mt-5">
                <h2 className="text-4xl font-bold tracking-wide uppercase text-white">
                    Leaderboard
                </h2>
            </div>

            {/* Leaderboard Table */}
            <div className="w-full max-w-3xl p-6 bg-sky-900 rounded-xl shadow-2xl mt-5">
                <table className="min-w-full text-center divide-y divide-gray-700">
                    <thead className="bg-sky-600 text-black">
                        <tr>
                            <th className="px-6 py-3 text-lg font-semibold tracking-widest">Rank</th>
                            <th className="px-6 py-3 text-lg font-semibold tracking-widest">User Name</th>
                            <th className="px-6 py-3 text-lg font-semibold tracking-widest">Correct Answers</th>
                            <th className="px-6 py-3 text-lg font-semibold tracking-widest">Time Taken (s)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-sky-800 text-white divide-y divide-gray-600">
                        {topUsers.length > 0 ? (
                            topUsers.map((user, index) => (
                                <tr key={user.userId} className={`text-2xl font-semibold ${index === 0 ? 'text-white' : ''}`}>
                                    <td className="px-6 py-4 border-t border-gray-700">{index + 1}</td>
                                    <td className="px-6 py-4 border-t border-gray-700">{user.name}</td>
                                    <td className="px-6 py-4 border-t border-gray-700">{user.correct}</td>
                                    <td className="px-6 py-4 border-t border-gray-700">{user.totalTimeTaken}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-gray-500">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

           
        </div>
    );
}

export default Leaderboard;
