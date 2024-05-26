module.exports = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};
