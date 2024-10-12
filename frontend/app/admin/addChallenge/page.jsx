'use client';
import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('question', question);
        options.forEach((option, index) => {
            formData.append(`options[${index}]`, option);
        });        formData.append('answer', answer);
        formData.append('image', image);
        if (url) formData.append('url', url);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl text-white font-semibold mb-6 text-center">Upload Challenge</h2>

            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                required
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            {options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                    className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}

            <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Correct Answer"
                required
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Challenge URL (optional)"
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                required
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md outline-none"
            />

            <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
            >
                Submit
            </button>
        </form>
    );
};

export default UploadForm;
