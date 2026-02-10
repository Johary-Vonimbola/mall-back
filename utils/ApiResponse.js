class ApiResponse {
    constructor(status = 200 , message = "", data = {} , errors = "") {
        this.status = status;
        this.message = message;
        this.data = data;
        this.errors = errors;
    }

    static succes(status = 200 , message = "" , data = {}) {
        return new ApiResponse(status, message, data, "");
    }

    static error(status = 400 , message = "" , errors = "") {
        return new ApiResponse(status, message, {}, errors);
    }
}

module.exports = ApiResponse;