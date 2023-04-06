const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv =require('dotenv').config();
const app = express();

const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://localhost:3000',
        'https://localhost:3001',
        process.env.FRONT_URL,
        process.env.BACK_URL,
    ]
}

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


require('./config/models');
require('./components/auth/authRoute')(app);
require('./components/tickets/ticketsRoute')(app);
require('./components/users/usersRoute')(app);
require('./components/roles/rolesRoute')(app);
require('./components/tokens/tokensRoute')(app);
require('./components/mail/mailRoutes')(app);
require('./components/elastichsearch');

app.post('/', (req, res) => {
    res.send('Api TTT')
});

module.exports = app;