const mongoose = require("mongoose");

const challengeSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [
        {
            type: String,
            required: true
        },
    ],
    answer: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,   // Store the URL of the image
        required: true
    },
    url: {
      type: String,
      default: ''  

    }
});

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
