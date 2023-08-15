require('dotenv').config();
const connectDb = require('./connectDb');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
connectDb();

const authRouter = require("./auth/router");
app.use('/api/auth', authRouter);

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});