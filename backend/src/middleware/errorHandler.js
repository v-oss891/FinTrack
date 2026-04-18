const env = require('../config/env');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err); // log
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (env.nodeEnv === 'development') {
    sendErrorDev(error, res);
  } else {
    let formattedError = error;
    if (error.name === 'CastError') {
      formattedError = handleCastError(error);
    } else if (error.code === 11000) {
      formattedError = new AppError(`Duplicate value for ${Object.keys(error.keyValue).join(', ')}`, 400);
    } else if (error.name === 'ValidationError') {
      formattedError = handleValidationError(error);
    } else if (error instanceof jwt.JsonWebTokenError) {
      formattedError = new AppError('Invalid token', 401);
    }
    sendErrorProd(formattedError, res);
  }
};

module.exports = globalErrorHandler;
