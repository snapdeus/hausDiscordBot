function splitMessage(message, maxLength = 20) {
    const messageChunks = [];
    for (let i = 0; i < message.length; i += maxLength) {
        messageChunks.push(message.slice(i, i + maxLength));
        console.log(messageChunks)
    }
    return messageChunks;
}
const latinText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

splitMessage(latinText)


