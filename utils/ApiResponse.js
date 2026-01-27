class ApiResponse {
    constructor(status = 200 , messages = "", data = {} , errors = "") {
        this.status = status;
        this.messages = messages;
        this.data = data;
        this.errors = errors;
    }

    static succes(status = 200 , messages = "" , data = {}) {
        return new ApiResponse(status, messages, data, "");
    }

    static error(status = 400 , messages = "" , errors = "") {
        return new ApiResponse(status, messages, {}, errors);
    }
}

module.exports = ApiResponse;