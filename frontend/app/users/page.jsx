'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import withAuth from '../components/withAuth';

function Users() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/allUsers`);
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
        <div className="flex flex-col items-center justify-center min-h-screen  bg-sky-600">
            <Navbar />
                <h1 className="text-3xl font-bold text-white mt-28 mb-10">Users</h1>
            <div className="container mx-auto mt-5 p-4">
                <div className="bg-white p-6 rounded-md shadow-md mb-6">
                    <p className="text-gray-700 mb-4">Search for users:</p>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full p-2 text-black border border-gray-300 rounded-md"
                        placeholder="Search for Matching Users"
                    />
                </div>
                <div className="bg-white text-gray-900 p-4 rounded-md mb-4">
                <h2 className="text-xl mb-4">Users</h2>

                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 border-t border-gray-300 text-gray-800">{user.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-2 text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default withAuth(Users);
