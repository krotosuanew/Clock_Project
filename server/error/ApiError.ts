class ApiError extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message: string): object {
        return new ApiError(400, message)
    }

    static internal(message: string): object {
        return new ApiError(500, message)
    }

    static forbidden(message: string): object {
        return new ApiError(403, message)
    }

    static Unauthorized(message: string): object {
        return new ApiError(401, message)
    }

    static NotFound(message: string): object {
        return new ApiError(404, message)
    }

    static Conflict(message: string): object {
        return new ApiError(409, message)
    }
}

export default ApiError