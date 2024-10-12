const express = require("express");
const multer = require('multer');
const {
  createChallenge,
  getChallenges,
  submitAnswer,
  getUserAnswers,
  usersWithCorrectAnswers,
  contestFinish,
  contestStatus
} = require("../controllers/challengesController");
const { protect } = require("../middleware/authMiddleware");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.route("/create").post(upload.single('image'), createChallenge);
router.route("/view").get(getChallenges);
router.route("/submitAnswer").post(protect, submitAnswer);
router.route("/userAnswers").get(protect, getUserAnswers);
router.route("/usersWithCorrectAnswers").get(usersWithCorrectAnswers);
router.route("/contest/finish").post(protect, contestFinish);
router.route("/contest-status").get(protect, contestStatus);

module.exports = router;