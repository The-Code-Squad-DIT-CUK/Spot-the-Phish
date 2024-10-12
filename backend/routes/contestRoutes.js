const express = require("express")
const {contestTime, getContestTimes} = require("../controllers/contestController")
const { protect } = require("../middleware/authMiddleware")


const router = express.Router()

// router.route("/create").post(protect, createChallenge)
router.route("/contest/times").post(contestTime);
router.route("/competition-times").get(getContestTimes)



module.exports = router