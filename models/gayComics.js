
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const GayComicSchema = new Schema({
    title: String,
    description: String,
    // path: String,
    filename: String,
    image: String,
    ordinality: Number,
    series: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    gayComments: [
        {
            type: Schema.Types.ObjectId,
            ref: "GayComment"
        }
    ]
}, opts)


module.exports = mongoose.model('GayComics', GayComicSchema)