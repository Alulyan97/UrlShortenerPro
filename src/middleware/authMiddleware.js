const jwt =require ("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;

    if(!header) {
        return res.status(401).json({ error: "Токен не предоставлен"})
    }

    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Неверный формат токена"})
    }
};

try {
    const decryptionJwt = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decryptionJwt.userId;
    next();
} catch (err) {
    if (err.name === "TokenExpiredError") {
        return res.satus(401).json({ error: "Токен истек"});
    }
    return res.status(401).json({error: "Неверный токен"})
};

module.exports = authMiddleware;