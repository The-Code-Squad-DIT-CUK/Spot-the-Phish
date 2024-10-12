const mongoose = require("mongoose");

const userAnswerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  correct: {
    type: Number,
    default: 0
  },
  wrong: {
    type: Number,
    default: 0
  },
  contestFinished: {
    type: Boolean,
    default: false, // Initially, the contest is not finished
  },
  totalTimeTaken: {
    type: Number, // Store the total time taken in milliseconds
    default: 0,
  },

  answered: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge', // Reference to Challenge (question) model
        required: true
      },
      selectedOption: {
        type: String, // Store the actual option text
        required: true
      },
      correctAnswer: {
        type: String, // Store the actual correct option text
        required: true
      }
    }
  ]
});

const UserAnswer = mongoose.model("UserAnswer", userAnswerSchema);

module.exports = UserAnswer;
