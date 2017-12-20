const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var {User} = require('./models/users.js');

mongoose.Promise = global.Promise;

var db = mongoose.connect('mongodb://localhost:27017/Register');

mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});


var app = express();

app.use(express.static(__dirname + 'views'));
app.use(express.static(__dirname + '/views'));
//app.use(express.static(__dirname  + '/views'));
app.set('view engine','hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/registration',(req,res)=>{
    res.render('registration.hbs');
})



app.get('/',(req,res)=>{
    res.render('login.hbs');
});




app.post('/loggedin',(req,res)=>{
    
    if(req.body.lUsername==='admin' && req.body.lPassword==='admin'){
        User.find({}).then((docs)=>{
//            res.send({docs});
//            console.log(docs);
            return res.render('index.hbs',{docs:docs});
        },(e)=>{
             res.status(404).send("hello");
        })
    }else{
    
    User.findOne({
        email:req.body.lUsername,
        password:req.body.lPassword
    }).then((docs)=>{
        if(docs===null){
            return res.status(400).send('<h1>Wrong Password and Email</h1>') ;
        }
        return res.render('page.hbs');
        //res.status(200).send('<h1>Login Successfull</h1>');
    },(e)=>{
        res.status(404).send(e);
    })
    }
});


app.post('/registered',(req,res)=>{
    
    var user = new User({
        name:req.body.name,
        age:req.body.age,
        contact:req.body.number,
        email:req.body.email,
        password:req.body.password
    });
    
    user.save().then((docs)=>{
        
        //res.send('<h1>Registration complete</h1>');  
        res.redirect('/');
        
    },(e)=>{
        res.status(404).send('Oops Something went Wrong.Plz Register Again');
        console.log(e);
    })
    
});



app.listen(3000,()=>{
    console.log('connection on 3000');
})