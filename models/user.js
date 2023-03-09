const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const UserSchema = new Schema({
    username: String,
    userId: String,
    guildId: String,
    memories: [],

}, opts)

const conn = mongoose.createConnection(`mongodb://127.0.0.1:27017/butler-db?authSource=butler-db`, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
    user: process.env.BUTLER_USER,
    pass: process.env.BUTLER_PW,
    autoIndex: false
});



module.exports = conn.model('User', UserSchema)