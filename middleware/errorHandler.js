const notFound = (req, res, next) => {
  console.log("not found");
  const error = new Error(`not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.log("error handler");
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  req.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { notFound, errorHandler };
