const express = require("express")
const {registerUser, authUser, adminRegister, getProfile, getUsers, updateUser, userScoreboard, getSequentialIdProfile} = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")


const router = express.Router()

router.route("/register").post(registerUser)
router.route("/admin/register").get(adminRegister)
router.route("/login").post(authUser)
router.route("/profile").get(protect, getProfile)
router.route("/update").put(protect, updateUser)
router.route("/allUsers").get(getUsers)
router.route("/users/scoreboard").get(userScoreboard)
router.route("/users/:sequentialId").get(getSequentialIdProfile)
module.exports = router