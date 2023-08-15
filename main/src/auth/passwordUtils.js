const bcrypt = require('bcryptjs');

// todo password hashing does not work rn
const encrypt = (plaintextPassword) => {
  console.log(plaintextPassword);
  return bcrypt.genSalt(10, (e, salt) => {
    if (e) {
      throw e;
    }
    return bcrypt.hash(plaintextPassword, salt, (e2, hash) => {
      if (e2) {
        throw e2;
      }
      return hash;
    });
  });
};

exports.encrypt = encrypt;