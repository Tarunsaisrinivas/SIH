const { default: mongoose } = require('mongoose');

const dbSchema = new mongoose.Schema({
    userName: String,
    password: String,
    details: {
        criminalCase : String,
        educationDetails: String,
        caste:String,
        job:String,
        ownHouse:String,
        vehicle:String,
        income:String,
        age : String,
        nationality: String


    }
});
 

const User = mongoose.model('user',dbSchema);

module.exports = User