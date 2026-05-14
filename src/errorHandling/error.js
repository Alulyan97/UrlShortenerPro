class ErrorHandling extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
    }
}

class InvalidRequestError extends ErrorHandling {
    constructor(message = "Неверный запрос") {
        super(message, 400);
    }
}

class NotAuthorizedError extends ErrorHandling { 
    constructor(message = "Не авторизован") {
        super(message, 401);
    }
}

class NoAccesError extends ErrorHandling { 
    constructor(message = "Нет доступа") {
        super(message, 403);
    }
}

class NotFoundError extends ErrorHandling { 
    constructor(message = "Не найдено") {
        super(message, 404);
    }
}

class AlreadyExistsError extends ErrorHandling { 
    constructor(message = "Уже существует") {
        super(message, 409);
    }
}

module.exports = {
    ErrorHandling,
    InvalidRequestError,
    NotAuthorizedError,
    NoAccesError,
    NotFoundError,
    AlreadyExistsError
}