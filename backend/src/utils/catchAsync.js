// replace the try-catch blocks in controllers for keeping code clean
module.exports = (fn) => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
