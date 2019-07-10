//https://codeburst.io/getting-started-with-pug-template-engine-e49cfa291e33
//https://coolors.co/343434-fcf7ff-c4cad0-878c8f-30c5ff

//appdb
//depfor-3gEswe-dewkyp
//mongodb+srv://appdb:depfor-3gEswe-dewkyp@cluster0-e8ufm.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const uuid = require('uuid/v4');
const querystring = require('querystring');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    role: String,
    age: Number,//{ type: Number, min: 18, max: 70 },
    createdDate: { type: Date, default: Date.now }
});
const user = mongoose.model('userCollection', userSchema);

//NYUP95V1CNl4nrqV
mongoose.connect('mongodb+srv://appdb:NYUP95V1CNl4nrqV@cluster0-szlfg.mongodb.net/users?retryWrites=true&w=majority',

{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected.');
});

const viewsFolder = path.join(__dirname, 'views');

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'pug');
app.set('views', viewsFolder);

app.use(express.static(viewsFolder));

app.get('/', (req, res) => {
    res.render('newusers', { });
});


app.post('/addUser', (req, res) => {
    const newUser = new user();
    newUser.id = uuid();
    newUser.name = req.body.FirstName + " " + req.body.LastName;
    newUser.email = req.body.Email;
    newUser.age = req.body.Age;
    newUser.role = req.body.Role;
    newUser.save((err, data) => {
        if (err) {
            return console.error(err);
        };
        res.redirect('/users');
    });
});

app.get('/users', (req, res) => {
    let allUsers = [];
    if (req.query.Name){
        let qname = req.query.Name;
        user.find({'name': {$regex: qname, "$options": "i" }}, function (err, users) {
            if (err) return console.error(err);
            users.forEach(user => {
                if (user.name.includes(qname)){
                    allUsers.push(
                        {
                            UserId: user.id,
                            Name: user.name,
                            Email: user.email,
                            Age: user.age,
                            Role: user.role
                        }
                    );
                };
            });
            res.render('users', { userData: allUsers });
        });
    }else{
        user.find(function (err, users) {
            if (err) return console.error(err);
            users.forEach(user => {
                allUsers.push(
                    {
                        UserId: user.id,
                        Name: user.name,
                        Email: user.email,
                        Age: user.age,
                        Role: user.role
                    }
                );
            });
            res.render('users', { userData: allUsers });
        });
    }
});

app.get('/users/editView', (req, res) => {
    let usrid = req.query.usrid;
    user.findOne({ id: usrid }, function (err, foundUser) {
        if (err){console.log(err)};
        res.render('editView', { userid: usrid, name: foundUser.name, age: foundUser.age, email: foundUser.email });
    });
});

app.post('/updateUser', (req, res) => {
    user.findOneAndUpdate({ id: req.body.Id }, {
        name: req.body.Name, 
        email: req.body.Email,
        age: Number(req.body.Age),
        role: req.body.Role
    }, () => {
        res.redirect('/users');
    });
});

app.get('/users/deleteView', (req, res) => {
    let usrid = req.query.usrid;
    user.findOneAndDelete({ id: usrid }, () => {
        res.redirect('/users');
    });
});

app.get('/users/sortAscending', (req, res) => {
    let allUsers = [];
    user.find({}).sort({name: 'ascending'}).exec(function (err, users) {
        if (err) return console.error(err);
        users.forEach(user => {
            allUsers.push(
                {
                    UserId: user.id,
                    Name: user.name,
                    Email: user.email,
                    Age: user.age,
                    Role: user.role
                }
            );
        });
        res.render('users', { userData: allUsers });
    });
});

app.get('/users/sortDescending', (req, res) => {
    let allUsers = [];
    user.find({}).sort({name: 'descending'}).exec(function (err, users) {
        if (err) return console.error(err);
        users.forEach(user => {
            allUsers.push(
                {
                    UserId: user.id,
                    Name: user.name,
                    Email: user.email,
                    Age: user.age,
                    Role: user.role
                }
            );
        });
        res.render('users', { userData: allUsers });
    });
});


app.listen(app.get('port'), () => console.log(`Example app listening on port ${app.get('port')}!`));