'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MdFullscreen } from 'react-icons/md';
import SmallTimer from "../components/SmallTimer"
import { useRouter } from 'next/navigation';


// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Challenges = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [userId, setUserId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [contestStartTime, setContestStartTime] = useState(null);
  const [contestEndTime, setContestEndTime] = useState(null);
  const [showUrl, setShowUrl] = useState(false);
  const [contestStarted, setContestStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [contestFinished, setContestFinished] = useState(false);
  const [loding, setLoading] = useState(true)

  const router = useRouter();


  const fullscreenWrapperRef = useRef(null);

  useEffect(() => {
    const fetchContestStatus = async () => {
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/contest-status`, config);
        setContestFinished(response.data.contestFinished);
      } catch (error) {
        console.error('Error fetching contest status:', error);
        // setError('Failed to fetch contest status. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContestStatus();
  }, [userId]);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/t/competition-times`);
        const data = res.data;
        setContestStartTime(new Date(data.startTime));
        setContestEndTime(new Date(data.endTime));
  
      } catch (error) {
        console.error('Failed to fetch contest times:', error);
      }
    };

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      setError('User not authenticated. Please log in.');
      return;
    }
    setUserId(userInfo);

    fetchTimes();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/view`);
      const shuffledQuestions = shuffleArray(data); // Shuffle questions
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchUserAnswers = async () => {
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
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/userAnswers`,config);
      const answersMap = {};
      const submittedMap = {};
      data.forEach((answer) => {
        if (answer.question && answer.question._id) {
          answersMap[answer.question._id] = answer.selectedOption;
          submittedMap[answer.question._id] = true;
        }
      });
      setAnswers(answersMap);
      setSubmitted(submittedMap);
    } catch (error) {
      console.error('Error fetching user answers:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserAnswers();
    }
  }, [userId]);

  useEffect(() => {
    if (questions.length && currentQuestionIndex < questions.length) {
      const currentQuestionId = questions[currentQuestionIndex]._id;
      if (answers[currentQuestionId] !== undefined) {
        setSelectedAnswer(answers[currentQuestionId]);
      } else {
        setSelectedAnswer(null);
      }
    }
  }, [currentQuestionIndex, questions, answers]);

  const handleOptionClick = (option) => {
    const currentQuestionId = questions[currentQuestionIndex]._id;
    if (!submitted[currentQuestionId]) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    const currentQuestionId = questions[currentQuestionIndex]._id;

    if (submitted[currentQuestionId]) {
      // Show popup if already submitted
      setShowPopup(true);
      return;
    }

    if (!selectedAnswer) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo) {
          setError('User not authenticated. Please log in.');
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
            "Content-type": "application/json",
          },
        };
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/submitAnswer`, {
        questionId: currentQuestionId,
        selectedOption: selectedAnswer,
      }, config);
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: selectedAnswer }));
      setSubmitted((prev) => ({ ...prev, [currentQuestionId]: true }));
    } catch (error) {
      console.error('Error submitting answer:', error.response?.data || error.message);
      setShowPopup(true);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) =>
      prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleFullscreen = () => {
    if (fullscreenWrapperRef.current) {
      if (fullscreenWrapperRef.current.requestFullscreen) {
        fullscreenWrapperRef.current.requestFullscreen();
      } else if (fullscreenWrapperRef.current.mozRequestFullScreen) {
        // Firefox
        fullscreenWrapperRef.current.mozRequestFullScreen();
      } else if (fullscreenWrapperRef.current.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        fullscreenWrapperRef.current.webkitRequestFullscreen();
      } else if (fullscreenWrapperRef.current.msRequestFullscreen) {
        // IE/Edge
        fullscreenWrapperRef.current.msRequestFullscreen();
      }
    }
  };


  const handleFinishContest = async() => {
    try {
      const finishTime = new Date();
      const timeTaken = (finishTime - contestStartTime) / 1000; // Time taken in seconds      

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!userInfo) {
        setError('User not authenticated. Please log in.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/c/contest/finish`, {
        timeTaken,
      }, config);

      router.push('/');
    } catch (error) {
      console.error('Error finishing contest:', error);
      // setError('Failed to finish contest. Please try again.');
    }
  };


  if (!questions.length) return <p>Loading...</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswerSubmitted = submitted[currentQuestion._id];

  const Popup = ({ message, onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white text-black p-4 rounded-lg shadow-lg border border-gray-300 max-w-sm w-full">
          <p>{message}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const currentTime = new Date();
  const isContestOngoing = currentTime >= contestStartTime && currentTime <= contestEndTime;

  return (
    <div className="min-h-screen flex flex-col bg-sky-600">
    <Navbar />

    <div className="flex-grow flex flex-col items-center justify-center w-full px-4 mt-28 mb-10">
      {currentTime < contestStartTime ? (
        <p className="text-xl text-white">The contest has not started yet. Please check back later.</p>
      ) : contestFinished ? (
        <p className="text-xl text-white">You have already finished the contest.</p>
      ) : (
        <>
        <SmallTimer contestEndTime={contestEndTime} />
         {/* Display current question number below the timer */}
         <p className="text-lg text-white mt-4">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          {currentQuestion && (
            <div className="w-full max-w-5xl bg-sky-600 rounded-lg overflow-hidden">
              <div className="relative" ref={fullscreenWrapperRef}>
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentQuestionIndex + 1}`}
                  className="w-full h-auto max-h-screen object-contain"
                  onMouseEnter={() => setShowUrl(true)}
                  onMouseLeave={() => setShowUrl(false)}
                />
                {showUrl && currentQuestion.url && (
                  <div className="fixed bottom-0 left-0 p-2 bg-black text-white text-sm z-50">
                    <a href={currentQuestion.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {currentQuestion.url}
                    </a>
                  </div>
                )}
                <button
                  onClick={handleFullscreen}
                  className="absolute top-2 right-2 p-2 bg-black text-white rounded-full"
                >
                  <MdFullscreen size={24} />
                </button>
              </div>
              <div className="p-4 mt-12">
                <div className="flex space-x-4 mb-4">
                  {currentQuestion.options.slice(0, 2).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={isAnswerSubmitted}
                      className={`flex-1 p-3 rounded-md text-black border-2 hover:bg-blue-500 ${
                        selectedAnswer === option ? 'bg-blue-500' : 'bg-white'
                      } ${isAnswerSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-16">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-white border-2 bg-sky-900 hover:bg-blue-500 rounded-md  w-40 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedAnswer === null || isAnswerSubmitted || !isContestOngoing}
                    className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded-md w-96 disabled:opacity-50"
                  >
                    Submit
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-4 py-2 text-white border-2 bg-sky-900 hover:bg-blue-500 text-white rounded-md w-40 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={handleFinishContest} 
            className="fixed top-0 right-0 m-4 px-6 py-3 mt-28 bg-red-500 text-white rounded-md"
          >
            Finish
          </button>
        </>
      )}
    </div>
    {showPopup && (
      <Popup
        message="You have already submitted an answer for this question."
        onClose={() => setShowPopup(false)}
      />
    )}
  </div>
  );
};

export default Challenges;
