const mongoose = require('mongoose');
const User = require('../../schemas/User')

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hasCriminalRecord: {
    type: Boolean,
    default: false, // Default value is false, change as needed
  },
  education: {
    type: String,
    enum: ['ug degree', 'pg degree', 'ug masters', 'pg masters'],
    lowercase: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  nationality: {
    type: String,
    uppercase: true, // Store nationality in uppercase
    required: true,
  },
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);


async function getData() {
    var username = document.getElementById('user').innerHTML.split(' ')[1]
    var criminalCase = document.getElementById("dropdown").value;
    var education = document.getElementById("education").value;
    var age = document.getElementById("age").value;
    var nationality = document.getElementById("nationality").value;

    var user = await User.findOne({
        userName : username
    }) 

    // console.log(username)
    // console.log("Criminal Case: " + criminalCase);
    // console.log("Education: " + education);
    // console.log("Age: " + age);
    // console.log("Nationality: " + nationality);
}