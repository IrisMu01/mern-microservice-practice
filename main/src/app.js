require('dotenv').config();
const connectDb = require('./connectDb');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
connectDb();
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24 }, // one day
    resave: false
}));
app.use(cookieParser());

const authRouter = require("./microservices/auth/router");
app.use('/api/auth', authRouter);
const logRouter = require("./microservices/log/router");
app.use('/api/log', logRouter);

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});