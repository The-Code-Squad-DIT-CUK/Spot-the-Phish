const express = require('express');
const Challenge = require('../models/challengesModel');
const UserAnswer = require('../models/userChallengeMode');
const asyncHandler = require('express-async-handler');
const { storage, ref, uploadBytes, getDownloadURL } = require('../firebase');

// Configure multer for file uploads (memory storage)

const createChallenge = asyncHandler(async (req, res) => {
    try {
        const { question, options, answer, url } = req.body; // Extracting form data
        const imageFile = req.file; // Image file uploaded from the frontend

        if (!imageFile) {
            return res.status(400).send({ message: 'Image file is required' });
        }
        let optionsArray = Array.isArray(options) ? options : options.split(',');

        // Firebase Storage reference and file upload
        const fileName = `${Date.now()}-${imageFile.originalname}`;
        const storageRef = ref(storage, `images/${fileName}`);

        // Upload the file to Firebase
        const uploadResult = await uploadBytes(storageRef, imageFile.buffer);
        
        // Get the download URL of the uploaded image
        const imageUrl = await getDownloadURL(uploadResult.ref);

        // Save challenge data and image URL in MongoDB
        const newChallenge = new Challenge({
            question,
            options: optionsArray,
            answer,
            imageUrl,
            url: url || '' // Use provided URL or default to an empty string
        });

        await newChallenge.save();
        res.status(201).send({ message: 'Challenge and image saved successfully!', challenge: newChallenge });
    } catch (error) {
        console.error('Error uploading image and saving data:', error);
        res.status(500).send({ message: 'Server error' });
    }
});



const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find(); // Retrieve all challenges from the database
    res.status(200).json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Error fetching challenges' });
  }
};


// Submit an answer
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, selectedOption } = req.body;
  const userId = req.user._id;

  const question = await Challenge.findById(questionId);
  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  let userAnswer = await UserAnswer.findOne({ userId , 'answered.question': questionId });

  if (userAnswer) {
    return res.status(400).json({ message: 'Answer already submitted for this question' });
  }

  // Compare the selected option text directly with the correct answer
  const isCorrect = selectedOption === question.answer;

  userAnswer = await UserAnswer.findOneAndUpdate(
    { userId },
    {
      $push: {
        answered: {
          question: questionId,
          selectedOption,
          correctAnswer: question.answer,
          isCorrect
        }
      },
      $inc: {
        total: 1,
        correct: isCorrect ? 1 : 0,
        wrong: isCorrect ? 0 : 1
      }
    },
    { new: true, upsert: true }
  );

  res.status(201).json({ message: 'Answer submitted successfully', isCorrect });
});

// Update the getUserAnswers function
const getUserAnswers = asyncHandler(async (req, res) => {
  const  userId  = req.user._id;

  const answers = await UserAnswer.find({ userId }).populate({
    path: 'answered.question',
    select: 'question options answer'
  });

  const formattedAnswers = answers.flatMap(answerRecord =>
    answerRecord.answered.map(answer => ({
      question: answer.question.question,
      selectedOption: answer.selectedOption,
      correctAnswer: answer.question.answer,
      isCorrect: answer.isCorrect
    }))
  );

  res.json(formattedAnswers);
});

const usersWithCorrectAnswers = asyncHandler(async (req, res) => {
  try {
    const results = await UserAnswer.aggregate([
      {
        $lookup: {
          from: 'users', // Collection name of User model
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: "$userId",
          name: "$user.name",
          correct: 1,
          total: 1,
          totalTimeTaken: { $ifNull: ["$totalTimeTaken", "$user.totalTimeTaken"] },          accuracy: { 
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $divide: ["$correct", "$total"] }
            ]
          }
        }
      },
      {
        $sort: { correct: -1, accuracy: -1 }
      }
    ]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching users with correct answers:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const contestFinish = asyncHandler(async (req, res) => {
  const { timeTaken } = req.body;
  const userId = req.user._id;

  const result = await UserAnswer.findOneAndUpdate(
    { userId },
    { 
      $set: { 
        contestFinished: true,
        totalTimeTaken: timeTaken 
      }
    },
    { new: true, upsert: true }
  );

  if (!result) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ message: 'Contest finished successfully' });
});


const contestStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Access user ID directly from req.user
  const user = await UserAnswer.findOne({ userId }); // Use findOne instead of findById

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ contestFinished: user.contestFinished });
});



module.exports = { createChallenge, getChallenges, submitAnswer, getUserAnswers, usersWithCorrectAnswers, contestFinish, contestStatus}



