const axios = require('axios');
const { Writable } = require('stream');
const htmlparser2 = require('htmlparser2');

async function fetchOgImage(url) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch the HTML of the webpage
            const response = await axios.get(url, { responseType: 'stream' });

            // Create a variable to store the og:image content
            let ogImage = '';

            // Create a new parser with the desired callbacks
            const parser = new htmlparser2.Parser({
                onopentag: (name, attrs) => {
                    // Check if the current tag is a meta tag with property="og:image"
                    if (name === 'meta' && attrs.property === 'og:image') {
                        ogImage = attrs.content;
                        parser.end();
                    }
                },
                onend: () => {
                    resolve(ogImage);
                },
            });
            // Define a writable stream to handle response data
            const writableStream = new Writable({
                write(chunk, encoding, callback) {
                    // Pass the chunk of data to the parser
                    parser.write(chunk.toString());
                    callback();
                },
            });

            // Stream the response data into the writable stream
            response.data.pipe(writableStream);
            // Handle the end of the response data stream
            response.data.on('end', () => {
                parser.end();
            });
        } catch (error) {
            reject(`Error fetching og:image: ${ error.message }`);
        }
    });
}



exports.fetchOgImage = fetchOgImage;