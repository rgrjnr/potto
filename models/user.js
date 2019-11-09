const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let userSchema = mongoose.Schema({
    email: { type: String, required: true },

    fullname: String,
    hash: String,
    salt: String,
    permissions: { type: String, default: 'default' },
    created_on: { type: Date, default: Date.now },
    
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };
  
userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 1);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

userSchema.methods.toAuthJSON = function() {
    return {
      _id: this._id,
      email: this.email,
      permissions: this.permissions,
      token: this.generateJWT(),
    };
  };

let User = module.exports = mongoose.model('User', userSchema);