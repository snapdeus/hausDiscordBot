const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const memorySchema = new Schema({

    memoryId: String,
    userStatement: String,
    aiStatement: String,
    userId: String,
    userName: String,
    aiName: String

}, opts)

const MemoryBankSchema = new Schema({

    memories: [memorySchema],

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



module.exports = conn.model('MemoryBank', MemoryBankSchema)