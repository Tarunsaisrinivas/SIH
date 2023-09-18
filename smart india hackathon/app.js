const bodyParser = require('body-parser');
const express = require('express');
const { default: mongoose } = require('mongoose');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const app = express();

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
        age : String,
        nationality: String
    }
});


 




const User = mongoose.model('user',dbSchema);
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
        res.render('home',{user : usr, password: pass});
    }else{
        res.redirect('/login');
    }
});

app.post('/post-edudetails/:usr',(req,res) => {

    const usr = req.params.usr;
    const details = req.body;
    console.log(usr);

    User.findOneAndUpdate({userName: usr},{details : details}).then(() => console.log("updated succussfull")).catch(err => console.log(err));

});

//APIs 

app.post('/login', (req,res) => {
    const body = req.body;
    User.findOne({userName: body.userName}).then(user => {
        if(user){
            if(user.password == body.password)
            {
                res.cookie("user",body.userName);
                res.cookie("password", body.password);
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