const { request, response } = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds);
const express = require('express');
const PORT = 3001;
const app = express();
const cors = require('cors');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
const DB = {
    users: [
        {
            id: '1',
            name: 'Josh',
            email: 'penyo@abv.bg',
            password: 'peter',
            pictureEntries: 0,
            dateJoined: new Date()
        }
    ]
}

app.post('/SignIn',(request, response) => {
    if(request.body.email === DB.users[0].email && 
       request.body.password === DB.users[0].password) {
        response.json('success');
    } else {
        response.status(400).json('Error logging in');
    }
});

app.get('/profile/:id', (request, response) => {
    const { id } = request.params;
    let found = false;
    DB.users.forEach(users => {
        if(users.id === id) {
            found = true;
           return response.json(users);
        } 
    });
    if(!found) {
        response.status(404).json('No such user');
    }
});
app.put('/image', (request, response) => {
    const { id } = request.body;
    let found = false;
    DB.users.forEach(users => {
    if(users.id === id) {
        found = true;
        users.pictureEntries++;
       return response.json(users.pictureEntries);
    } 
});
    if(!found) {
        response.status(404).json('No such user');
    }
});
app.post('/Register', (request, response) => {
    let id =  (DB.users.length + 1).toString();
    const {email, name, password} = request.body;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        console.log(hash);
        // Store hash in your password DB.
    });
    DB.users.push({ id: id,
    name: name,
    email: email,
    password: password,
    pictureEntries: 0,
    dateJoined: new Date()
});
++id;
response.json(DB.users[DB.users.length - 1 ]);
});

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});

app.get('/', (request, response) => {
    response.send(DB.users);
});
app.listen(PORT);