const asyncHandler = (func) => (req, res, next) => {
    try {
        return func(req, res, next);
    } catch (error) {
        return res.send()
    }
}