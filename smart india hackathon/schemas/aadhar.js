const mongoose = require('mongoose')

const aadharSchema = new mongoose.Schema({
    adhar : String,
    income : String,
    criminalCase : String
})

const aadhar = mongoose.model('Aadhar',aadharSchema)

module.exports = aadhar