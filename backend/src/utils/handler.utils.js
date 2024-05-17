const asyncHandler = (func) => async(req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        console.log(error);
        res.status(error.code || 500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export { asyncHandler };