//https://codeburst.io/getting-started-with-pug-template-engine-e49cfa291e33
//https://coolors.co/343434-fcf7ff-c4cad0-878c8f-30c5ff

const express = require('express');
const path = require('path');
const uuid = require('uuid/v4');
const querystring = require('querystring');


const { Client } = require('pg');

const client = new Client({
    user: 'zyhpparcerwdfk',
    host: 'ec2-174-129-229-106.compute-1.amazonaws.com',
    database: 'd56u70oqj72vni',
    password: '9d01bfbd06c7517ebf08b30b4e0c99104d7d4921a92297ccaabb28eae2134ba3',
    port: 5432
});
client.connect();

const createTableText = `
CREATE TABLE IF NOT EXISTS users (
  id PRIMARY KEY,
  name varchar(50),
  email varchar(50),
  age int,
  role varchar(15)
);
`
client.query(createTableText);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//     console.log(err ? err.stack : res.rows[0].message); // Hello World!
//     client.end();
// });


const viewsFolder = path.join(__dirname, 'views');

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'pug');
app.set('views', viewsFolder);

app.use(express.static(viewsFolder));

app.get('/', (req, res) => {
    res.render('newusers', { });
});


app.post('/addUser', (req, res) => {
    // const newUser = new user();
    // newUser.id = uuid();
    // newUser.name = req.body.FirstName + " " + req.body.LastName;
    // newUser.email = req.body.Email;
    // newUser.age = req.body.Age;
    // newUser.role = req.body.Role;
    // newUser.save((err, data) => {
    //     if (err) {
    //         return console.error(err);
    //     };
    //     res.redirect('/users');
    // });

    const newUser = new User(
        uuid(),
        newUser.name = req.body.FirstName + " " + req.body.LastName,
        newUser.email = req.body.Email,
        newUser.age = req.body.Age,
        newUser.role = req.body.Role
    );
    client.query('INSERT INTO users(id, name, email, age, role) VALUES($1, $2, $3, $4, $5)', [newUser.id, newUser.name, newUser.email, newUser.age, newUser.role]);
});

app.get('/users', (req, res) => {
    let allUsers = [];
    const { rows } = client.query('SELECT * FROM users');
    if (req.query.Name){
        let qname = req.query.Name;
        
        // user.find({'name': {$regex: qname, "$options": "i" }}, function (err, users) {
        //     if (err) return console.error(err);
        //     users.forEach(user => {
        //         if (user.name.includes(qname)){
        //             allUsers.push(
        //                 {
        //                     UserId: user.id,
        //                     Name: user.name,
        //                     Email: user.email,
        //                     Age: user.age,
        //                     Role: user.role
        //                 }
        //             );
        //         };
        //     });
        //     res.render('users', { userData: allUsers });
        // });
    }else{
        // user.find(function (err, users) {
        //     if (err) return console.error(err);
        //     users.forEach(user => {
        //         allUsers.push(
        //             {
        //                 UserId: user.id,
        //                 Name: user.name,
        //                 Email: user.email,
        //                 Age: user.age,
        //                 Role: user.role
        //             }
        //         );
        //     });
        //     res.render('users', { userData: allUsers });
        // });
    }
    console.log(rows);
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