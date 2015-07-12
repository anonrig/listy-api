var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('listy/lib/crypto');



var AccountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, required: true },
    salt: { type: String, required: true, default: crypto.generateRandomString.bind(null, 8) },
    facebook: {
        id: { type: String },
        access_token: { type: String, unique: true },
        photo: { type: String }
    }
});

/**
 * Compare input with current password.
 * Add salt to input and take SHA256.
 *
 * @param password Input password.
 * @returns {boolean}
 */
AccountSchema.methods.checkPassword = function (password) {
    return this.password === crypto.sha256(password + this.salt);
};

/**
 * Set current password.
 * Add default salt to input and take SHA256 hash.
 *
 * @param password User input.
 * @returns {AccountSchema.methods}
 */
AccountSchema.methods.setPassword = function (password) {
    this.password = crypto.sha256(password + this.salt);
    return this;
};

module.exports = mongoose.model('Account', AccountSchema);