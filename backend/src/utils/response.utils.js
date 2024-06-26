const SuccessResponse = (res, message, data) => {
    return res.status(200).json({ success : true, message, data});
}

const ErrorResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({ success : false, message, data});
}

export { SuccessResponse, ErrorResponse };