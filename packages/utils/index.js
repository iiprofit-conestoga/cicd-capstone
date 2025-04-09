function formatDate(date) {
    return new Date(date).toISOString();
  }
  
const httpStatus = require('./httpStatus');
const { getHandlerResponse } = require('./responseHandler');

  module.exports = { formatDate, httpStatus, getHandlerResponse };