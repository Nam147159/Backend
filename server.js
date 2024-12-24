const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const config = require("config");
const databaseSettings = config.get(`DATABASE.${config.get("DATABASE_TYPE")}`);
const passport = require('passport');
const fs = require('fs');
const path = require('path');
const express = require('express');
import('open');

const app = express();

const db = require('knex')({
    client: 'pg',
    connection: {
        host : databaseSettings.get("HOST"),
        port : databaseSettings.get("PORT"),
        user : databaseSettings.get("USER"),
        password : databaseSettings.get("PASSWORD"),
        database : databaseSettings.get("DATABASE")
    }
});

app.set("db", db);
app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/auth/register', require("./routes/registerRoute"));
app.use('/api/auth/login', require("./routes/loginRoute"));
app.use('/api/spotify/', require("./routes/spotifyRoute"));

app.listen(config.get("API.PORT"), config.get("API.HOST"), () => {
    console.log(`Server is running on port ${config.get("API.PORT")}`);
    console.log(`${config.get("PROTOCOL")}://${config.get("SERVER_HOST")}`)
});