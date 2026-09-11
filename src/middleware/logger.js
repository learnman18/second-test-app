const logger = (req, res, next) => {
    console.log('middleware logger', `method : ${req.method} , URL: ${req.url}`);
    next();
}
module.exports = logger;