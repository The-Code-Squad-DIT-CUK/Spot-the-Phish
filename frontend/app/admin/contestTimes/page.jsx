'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContestTimes = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchContestTimes = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/t/contest/times`);
            if (response.data.contest) {
                setStartDate(new Date(response.data.contest.startDate).toISOString().slice(0, 16));
                setEndDate(new Date(response.data.contest.endDate).toISOString().slice(0, 16));
            }
        } catch (err) {
            setError('Failed to fetch contest times');
        }
    };

    useEffect(() => {
        fetchContestTimes();
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/t/contest/times`, {
                startDate: new Date(startDate).toISOString(),
                endDate: new Date(endDate).toISOString()
            });
            setMessage(response.data.message);
            fetchContestTimes(); // Refresh the times after update
        } catch (err) {
            setError('Failed to update contest times');
        }
    };

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg">
            <h1 className="text-xl mb-4">Contest Times</h1>
            <div className="mb-4">
                <label className="block mb-2">Start Date</label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 w-full bg-gray-700 text-white rounded-md"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">End Date</label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 w-full bg-gray-700 text-white rounded-md"
                />
            </div>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                Save
            </button>
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default ContestTimes;