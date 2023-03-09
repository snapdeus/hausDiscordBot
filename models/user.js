const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    username: String,
    userId: String,
    guildId: String,
    memories: [],

}, opts)

const myDB = mongoose.connection.useDb('butler-db');

module.exports = myDB.model('User', UserSchema)