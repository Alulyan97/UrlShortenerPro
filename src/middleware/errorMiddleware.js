const errorMiddleware = (err, req, res) => {
    console.error(err.message);

    if (err.success === false) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.statusCode,
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }

    res.status(500).json({
        success: false,
        status: 500,
        message: "Внутренняя ошибка сервера",
        timestamp: new Date().toISOString()
    });
};

module.exports = errorMiddleware;