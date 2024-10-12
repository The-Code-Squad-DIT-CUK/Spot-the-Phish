const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
     },
     semester: {
      type: String,
      required: true
   },
   phoneNo: {
      type: String,
      required: true
   },
   enrollmentNo: {
      type: String,
      required: true
   },
     email: {
        type: String,
        required: true,
        unique: true,
     },
     password: {
        type: String,
        required: true
     },
     sequentialId: {
      type: Number,
      unique: true,
      default: 0,
    },
   
});

const User = mongoose.model("User", userSchema);

module.exports = User;