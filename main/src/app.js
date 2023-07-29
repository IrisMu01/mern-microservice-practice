const db = require('./dbConnection');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
db.connect();

app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});