const bcrypt = require('bcryptjs');

const encrypt = (plaintextPassword) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintextPassword, salt);
};

const compare = (plaintextPassword, hash) => {
    return bcrypt.compareSync(plaintextPassword, hash);
}

const generateRandomString = (length) => {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}

exports.encrypt = encrypt;
exports.compare = compare;
exports.generateRandomString = generateRandomString;