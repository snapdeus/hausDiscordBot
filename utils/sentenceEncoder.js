// Import TensorFlow.js and the Universal Sentence Encoder
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// Define a function to encode a sentence into a vector
async function encodeSentence(sentence) {
    // Load the Universal Sentence Encoder model
    const model = await use.load();

    // Encode the sentence into a tensor of shape [1, 512]
    const embeddings = await model.embed(sentence);
    const tensor = embeddings.reshape([1, 512]);

    // Convert the tensor to a dense vector and return it
    const values = await tensor.array();
    return values[0];
}

// Example usage
const sentence = 'The quick brown fox jumps over the lazy dog.';


module.exports.doThis = async () => {
    const vector = await encodeSentence(sentence);
    return vector;
}

