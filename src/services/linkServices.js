const crypto = require("crypto");

const generateCode = (length = 6) => {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

const generateShortCode = (length = 6) => {
    return crypto.randomBytes(length).toString("base64url").slice(0, length);
};

module.exports = { generateCode, generateShortCode };