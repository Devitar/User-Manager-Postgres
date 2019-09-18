//https://codeburst.io/getting-started-with-pug-template-engine-e49cfa291e33
//https://coolors.co/343434-fcf7ff-c4cad0-878c8f-30c5ff

const express = require('express');
const path = require('path');
const uuid = require('uuid/v4');
const querystring = require('querystring');
const User = require('./user.js');

const { Client } = require('pg');

const connectionStr = process.env.PG_Connection_String;

const client = new Client({connectionString: connectionStr, ssl: true});
client.connect();

const resetTableString = `
    DROP TABLE users;
`;

const createTableString = `
CREATE TABLE IF NOT EXISTS users (
  id varchar(50),
  name varchar(50),
  email varchar(50),
  age int,
  role varchar(15)
);
`;

// client.query(resetTableString, (err, res) => {
//     if (err) throw err;
// });

client.query(createTableString, (err) => {
    if (err) throw err;
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const viewsFolder = path.join(__dirname, 'views');

app.set('port', process.env.PORT || 3000);

app.set('view engine', 'pug');
app.set('views', viewsFolder);

app.use(express.static(viewsFolder));

app.get('/', (req, res) => {
    res.render('newusers', { });
});

function FormatNumberLength(num, length) {
    const strNum = num.toString();
    const result = Number(strNum.slice(0, length));
    return result;
}
function FormatStringLength(str, length) {
    const result = str.slice(0, length);
    return result;
}

app.post('/addUser', (req, res) => {
    const newUser = new User(
        uuid(),
        FormatStringLength(req.body.FirstName + " " + req.body.LastName, 50),
        FormatStringLength(req.body.Email, 50),
        FormatNumberLength(req.body.Age, 3),
        req.body.Role
    );
    client.query('INSERT INTO users(id, name, email, age, role) VALUES($1, $2, $3, $4, $5)', [newUser.id, newUser.name, newUser.email, newUser.age, newUser.role], (err) => {
        if (err) 
            throw err;
        else{
            res.redirect('/users');
        }
    });
});

app.get('/users', (req, res) => {
    const allUsers = [];

    if (req.query.Name) {
        let qname = decodeURIComponent(req.query.Name).toLowerCase();
        client.query('SELECT * FROM users', (err, response) => {
            if (err) throw err;
            const allRows = response.rows;
            let filteredUsers = allRows.filter((v) => {
                return v.name.toLowerCase().includes(qname);
            });
            filteredUsers.forEach(user => {
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
    } else {
        client.query('SELECT * FROM users', (err, response) => {
            if (err) throw err;
            const allRows = response.rows;
            allRows.forEach(user => {
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
    };
});

app.get('/users/editView', (req, res) => {
    let usrid = req.query.usrid;
    const editQuery = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [usrid],
    };
    client.query(editQuery, (err, result) => {
        if (err) throw err;
        const foundUser = result.rows[0];
        res.render('editView', { userid: usrid, name: foundUser.name, age: foundUser.age, email: foundUser.email });
    });
});

app.post('/updateUser', (req, res) => {
    const usrId = req.body.Id;
    const updateQuery = {
        text: 
            `UPDATE users
            SET name = $2, email = $3, age = $4, role = $5
            WHERE
                id = $1;`,
        values: [usrId, req.body.Name, req.body.Email, req.body.Age, req.body.Role],
    };
    client.query(updateQuery, (err) => {
        if (err) throw err;
        res.redirect('/users');
    });
});

app.get('/users/deleteView', (req, res) => {
    let usrid = req.query.usrid;
    const deleteQuery = {
        name: 'delete-query',
        text: `DELETE FROM users WHERE id = $1`,
        values: [usrid],
    };
    client.query(deleteQuery, (err, response) => {
        if (err) throw err;
        res.redirect('/users');
    });
});

app.get('/users/sortAscending', (req, res) => {
    const allUsers = [];
    const ascendingQuery = {
        text: `SELECT * FROM users
        ORDER BY name ASC;`,
        values: [],
    };
    client.query(ascendingQuery, (err, response) => {
        if (err) throw err;
        response.rows.forEach(user => {
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
    const allUsers = [];
    const descendingQuery = {
        text: `SELECT * FROM users
        ORDER BY name DESC;`,
        values: [],
    };
    client.query(descendingQuery, (err, response) => {
        if (err) throw err;
        response.rows.forEach(user => {
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


app.listen(app.get('port'), () => console.log(`App listening on port ${app.get('port')}!`));