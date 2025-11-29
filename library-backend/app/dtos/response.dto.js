class ResponseDTO {
  constructor({ success = true, message = "", data = null, error = null }) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success(data, message = "Success") {
    return new ResponseDTO({
      success: true,
      message,
      data,
      error: null,
    });
  }

  static fail(error, message = "Failed", data = null) {
    return new ResponseDTO({
      success: false,
      message,
      data,
      error,
    });
  }
}

module.exports = ResponseDTO;
