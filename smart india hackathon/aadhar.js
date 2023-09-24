const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://tarun:tarunsai2341@cluster0.tbd0fbb.mongodb.net/login_DB?retryWrites=true&w=majority').then(() => {
    console.log("Connected Succussfull");
}).catch(err => console.log("Error Occured" + err));

const aadharSchema = new mongoose.Schema({
    adhar : String,
    income : String,
    criminalCase : String
})

const aadhar = mongoose.model('Aadhar',aadharSchema)


veri=[
    {
        "adhar":"637350603985",
        "income":"80000",
        "criminalCase":"no",
    },
    {
        "adhar":"607525356075",
        "income":"90000",
        "criminalCase":"no",
    },
    {
        "adhar":"637350603984",
        "income":"70000",
        "criminalCase":"no",
    },
    {
        "adhar":"637350603983",
        "income":"80000",
        "criminalCase":"yes",
    },
    {
        "adhar":"637350603900",
        "income":"8000",
        "criminalCase":"no",
    },
]

aadhar.insertMany(veri)