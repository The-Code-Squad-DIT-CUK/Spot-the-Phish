const express = require('express');
const router = express.Router();
const Contest = require('../models/contestModel');
const asyncHandler = require('express-async-handler');

// Set contest times (create or update contest)
const contestTime = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.body;

    try {
        // Check if there's an existing contest
        let contest = await Contest.findOne();

        if (contest) {
            // Update existing contest
            contest.startDate = startDate;
            contest.endDate = endDate;
            await contest.save();
            res.status(200).json({ message: 'Contest times updated successfully', contest });
        } else {
            // Create new contest
            contest = new Contest({
                startDate,
                endDate,
            });

            await contest.save();
            res.status(201).json({ message: 'Contest created and times set successfully', contest });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to set contest times', error: error.message });
    }
});

const getContestTimes = async (req, res) => {
    try {
        // Assuming you only have one active contest at a time
        const contest = await Contest.findOne().sort({ startDate: -1 }); // Adjust the query as needed

        if (!contest) {
            return res.status(404).json({ message: 'No active contest found' });
        }

        const startTime = contest.startDate;
        const endTime = contest.endDate;

        res.json({ startTime, endTime });
    } catch (error) {
        console.error('Failed to fetch contest times:', error);
        res.status(500).json({ message: 'Failed to fetch contest times', error: error.message });
    }
};

module.exports = { contestTime, getContestTimes };