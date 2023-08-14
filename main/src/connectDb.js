const mongoose = require('mongoose');

const db = {
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
}
const uri = `mongodb+srv://${db.username}:${db.password}@${db.url}/?retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {useNewUrlParser: true});
        console.log("Connected to database");
    } catch (e) {
        console.log("Failed connecting to database");
        console.error(e.message);
        process.exit(1);
    }
}

module.exports = connectDB;
