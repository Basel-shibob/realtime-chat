function errorHandler(err, req, res, next){
    console.log(err.stack);
    res.status(500).json({ error: "something went wrong"});
}

module.exports = errorHandler