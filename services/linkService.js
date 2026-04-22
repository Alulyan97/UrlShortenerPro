const { nanoid } = require("nanoid");

const generateCode = (length = 6) => {
    return nanoid(length);
};

module.exports = { generateCode };