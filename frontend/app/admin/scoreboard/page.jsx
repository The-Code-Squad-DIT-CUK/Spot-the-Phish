'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/usersWithCorrectAnswers`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-3xl font-bold mt-10 mb-10">Users</h1>
            <div className="container mx-auto mt-5 p-4">
                <div className="bg-gray-800 p-6 rounded-md shadow-md mb-6">
                    <p className="text-gray-300 mb-4">Search for users:</p>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
                        placeholder="Search for Matching Users"
                    />
                </div>
                <div className="bg-gray-800 text-gray-300 p-4 rounded-md mb-4">
                    <h2 className="text-xl mb-4">Users with Highest Correct Answers</h2>
                    <table className="min-w-full divide-y divide-gray-600">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Correct Answers</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Answers</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time Taken (s)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Accuracy</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-600">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.userId}>
                                        <td className="px-6 py-4 border-t border-gray-600">{user.name}</td>
                                        <td className="px-6 py-4 border-t border-gray-600">{user.correct}</td>
                                        <td className="px-6 py-4 border-t border-gray-600">{user.total}</td>
                                        <td className="px-6 py-4 border-t border-gray-600">{user.totalTimeTaken}</td>
                                        <td className="px-6 py-4 border-t border-gray-600">{(user.accuracy * 100).toFixed(2)}%</td>
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
        </div>
    );
}

export default Users;
