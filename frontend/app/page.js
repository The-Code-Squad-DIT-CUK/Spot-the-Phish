'use client';
import { useState, useEffect } from 'react';
import Navbar from "./components/Navbar";
import Image from "next/image";
// import { BackgroundBeams } from "./components/ui/background-beams";
import axios from 'axios';
import image from "../public/images/intro.gif"

const Home = () => {
  const [countdown, setCountdown] = useState({
    message: '',
    timeLeft: { days: '00', hours: '00', minutes: '00', seconds: '00' },
  });
  const [loading, setLoading] = useState(true); // State to manage loading


  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/t/competition-times`);
        const data = res.data; // Access the parsed JSON data directly

        const startTime = new Date(data.startTime);
        const endTime = new Date(data.endTime);




        const updateCountdown = () => {
          const now = new Date();
          let message = '';
          let targetTime = null;

          if (now < startTime) {
            message = 'Contest starting in...';
            targetTime = startTime;
          } else if (now < endTime) {
            message = 'Contest ends in...';
            targetTime = endTime;
          } else {
            message = 'Contest has ended';
            setCountdown({ message, timeLeft: { days: '00', hours: '00', minutes: '00', seconds: '00' } });
            return; // Stop the interval as the contest has ended
          }

          const difference = targetTime - now;

          if (difference <= 0) {
            setCountdown({ message, timeLeft: { days: '00', hours: '00', minutes: '00', seconds: '00' } });
            return;
          } else {
            const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            const minutes = String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, '0');
            const seconds = String(Math.floor((difference / 1000) % 60)).padStart(2, '0');

            setCountdown({ message, timeLeft: { days, hours, minutes, seconds } });
          }
        };

        // Initial countdown setup
        updateCountdown();
        // Update countdown every second
        const interval = setInterval(updateCountdown, 1000);

        setLoading(false);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);

      } catch (error) {
        console.error('Failed to fetch contest times:', error);
      }
    };

    fetchTimes();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-sky-600 text-white pt-7">
      <h1 className="text-5xl font-bold text-white mb-6 mt-24">Spot the Phish</h1>

        <Image src={image} alt="CTF Logo" className="w-72 h-auto mx-auto " />

        <div className="text-lg mb-6">
          {loading ? (
            <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full border-t-transparent animate-spin"></div>
          ) : (
            countdown.message
          )}
        </div>
        <div className="flip-clock">
          <div className="section">
            <div className="time">{countdown.timeLeft.days}</div>
            <div className="label">Days</div>
          </div>
          <div className="section">
            <div className="time">{countdown.timeLeft.hours}</div>
            <div className="label">Hours</div>
          </div>
          <div className="section">
            <div className="time">{countdown.timeLeft.minutes}</div>
            <div className="label">Minutes</div>
          </div>
          <div className="section">
            <div className="time">{countdown.timeLeft.seconds}</div>
            <div className="label">Seconds</div>
          </div>
        </div>

        <div className="mt-20 w-full max-w-4xl p-5 border border-white rounded-lg text-left bg-sky-700">
          <h2 className="text-xl font-bold mb-10 text-center">RULES</h2>
          <ol className="list-decimal list-inside space-y-3">
            <li>Contest Duration: The contest lasts for 60 minutes. Each student&apos;s timer starts when the contest begins and ends when they click the &quot;Finish&quot; button.</li>
            <li>Submission: Students must select an option and click &quot;Submit&quot; for each question. Answers are only recorded after submission. Submitted answers cannot be changed.</li>
            <li>Question Navigation: Students can move between questions freely. Unanswered questions can be skipped and returned to later.</li>
            <li>Tie-Breaker: If two students have the same score, the winner is determined by who finishes the contest in less time.</li>
  
          </ol>
        </div>

        <div className="mt-24 mb-11 w-full max-w-4xl mx-auto">
  <h2 className="text-2xl font-bold text-center mb-10">Organizing Body</h2>
  <div className="flex flex-col items-center">
    {/* Center card */}
    <div className="flex flex-col items-center mb-6">
      <div className="p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Peerzada Mohammad Sameem Makhdoomi</h3>
        <p className="text-sm text-gray-200">President, Code squad
        </p>
      </div>
    </div>

    {/* Grid for additional cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full mb-8">
      <div className="  lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Aayaan Khursheed</h3>
        <p className="text-sm text-gray-200">Cybersecurity club lead</p>
      </div>
      <div className=" lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Mohammad Ikhlas</h3>
        <p className="text-sm text-gray-200">Web Developer</p>
      </div>
      <div className=" lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Dayim</h3>
        <p className="text-sm text-gray-200">Web Developer</p>
      </div>
    </div>

    
    {/* Grid for additional cards */}
    {/* <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 w-full">
      <div className="  lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Aayaan Khursheed</h3>
        <p className="text-sm text-gray-200">Cybersecurity club lead</p>
      </div>
      <div className=" lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Mohammad Ikhlas</h3>
        <p className="text-sm text-gray-200">Web Developer</p>
      </div>
      <div className=" lg:block p-6 border border-white rounded-lg text-center bg-sky-700">
        <h3 className="text-lg font-bold mb-2">Mohammad Ikhlas</h3>
        <p className="text-sm text-gray-200">Web Developer</p>
      </div>
    </div> */}

  </div>
</div>

<footer className="mt-16 w-full bg-gray-900 py-4 text-center text-gray-400">
  <p className="text-sm flex items-center justify-center space-x-2">
    <span>© {new Date().getFullYear()}</span>
    <span>All rights reserved</span>
    <span>•</span>
    <span>Created by !khl@$</span>
  </p>
</footer>



      </div>
      {/* <BackgroundBeams /> */}
    </div>
  );
};

export default Home;