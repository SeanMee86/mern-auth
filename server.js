const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const getUsers = require('./routes/api/getUsers');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error));

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users, getUsers);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App listening on Port: ${port}!`));