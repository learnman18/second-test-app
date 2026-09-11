
//we can recogize err handler with err parameter.
const erroHandler = (err,req,res,next) => {
    console.error(err);
    res.status(500).json({
        message:"something went wronggg ",
        error: err.message
    })
}

module.exports = erroHandler;