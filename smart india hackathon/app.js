const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const app = express();
var nodemailer = require('nodemailer');
const fs = require('fs');
const aadhar = require('./schemas/aadhar');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine','ejs');


//DataBase


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

const scholarshipSchema = new mongoose.Schema({
        url : String,
        criminalCase : String,
        educationDetails: String,
        caste:String,
        job:String,
        ownHouse:String,
        vehicle:String,
        people:String,
        girl:String,
        income:String,
        age : String,
        nationality: String

})


const User = mongoose.model('user',dbSchema);
const Scholarships = mongoose.model('scholarship',scholarshipSchema);
mongoose.connect('mongodb+srv://tarun:tarunsai2341@cluster0.tbd0fbb.mongodb.net/login_DB?retryWrites=true&w=majority').then(() => {
    console.log("Connected Succussfull");
}).catch(err => console.log("Error Occured" + err));

app.listen(3000,(port) => {
    console.log('Server running on port: '+port);
})

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/signup', (req,res) => {
    res.sendFile(__dirname+'/signup.html');
});

app.get('/', (req,res) => {
    const usr = req.cookies.user;
    const pass = req.cookies.password;
    
    if(usr== 'admin@gmail.com')
    {
        res.render('admin',{user : usr, password: pass});
    }
    else if (usr){
        const details = req.cookies.details
        res.render('home', {
            user:usr,
            password:pass,
            criminalCase: details.criminalCase,
            educationDetails: details.educationDetails,
            caste: details.caste,
            job: details.job,
            ownHouse: details.ownHouse,
            vehicle: details.vehicle,
            income: details.income,
            age: details.age,
            nationality: details.nationality,
        });
    }else{
        
        const data = fs.readFileSync('index.html', 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }
});

app.post('/post-edudetails/:usr',(req,res) => {

    const usr = req.params.usr;
    const details = req.body;
    console.log(usr);

    User.findOneAndUpdate({userName: usr},{details : details}).then(() => console.log("updated succussfull")).catch(err => console.log(err));

});

app.post('/postedudetails/admin',async (req,res) => {

    const usr = req.params.usr;
    const details = req.body;
    const url = details.url
    console.log(usr);
    delete details.url
    console.log(details);
    await Scholarships.create({...details})

    var eligibleUsers = await User.find({details : details})
    var emails = []
    await eligibleUsers.map(
        (user)=>{
            console.log(user);
            emails.push(user.userName)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'tarunsaisrinivas7@gmail.com',
                  pass: 'cgtw trom outi dsdw'
                },
                tls: {
                    rejectUnauthorized: false
                  }
              });``
              
              var mailOptions = {
                from: 'venkatsaisrkr1010@gmail.com',
                to: `${user.userName}`,
                subject: 'You are eligible for this!',
                text: `
                        We are delighted to let you know that you might be eligible for this scholarship.
                        Here is the link : ${url}
                `
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        }
    )
    res.render('admin1',{
        emails : emails
    })

});

//APIs 

app.get('/adhar',async (req,res)=>{
    const users = await aadhar.find({})
    res.status(200).json({users})
})

app.post('/login', (req,res) => {
    const body = req.body;
    User.findOne({userName: body.userName}).then(user => {
        if(user){
            if(user.password == body.password)
            { 
                console.log(user);
                res.cookie("user",user.userName);
                res.cookie("password", user.password);
                res.cookie('details',user.details)
                res.json({stat: true, msg: "User Atunticated"});
            }else{
                res.json({stat: false, msg: "Wrong password"});
            }
        }
        else{
            res.json({stat: false, msg: "Invalid User"});
        }
    }).catch(err => {
        res.json({stat: false, msg: "Error in connecting to DB"});
    });
});

app.post('/signup', (req,res) => {

    const body = req.body;
    User.findOne({userName: body.userName}).then(usr => {
        if(usr){
            res.json({stat: false, msg: "User already exist"});
        }
        else{
            const newUser = new User({
                userName : body.userName,
                password : body.password
            });
            newUser.save().then(() => {
                res.json({stat: true, msg: "User name Accepcted"});
            }).catch(err => {
                res.json({stat: false, msg: "Error in adding new user"});
            })
        }
    }).catch(err => {
        res.json({stat: false, msg: "Error in connecting to DB"});
        console.log(err);
    });

});

app.post('/logout', (req,res) => {
    res.clearCookie('user');
    res.clearCookie('password');
    res.json({stat: true});
})