// Utility to create a standardized response object
const createResponse = (status, success, message, data = null) => {
    return {
      status,
      success,
      message,
      data,
    };
  };
  
  // Generalized success response
  export const successResponse = (res, message, data = null, status = 200) => {
    res.status(status).json(createResponse(status, true, message, data));
  };
  
  // Generalized error response
  export const errorResponse = (res, message, status = 400, data = null) => {
    res.status(status).json(createResponse(status, false, message, data));
  };
  
  // Specific error responses
  export const errorResponse401 = (res, message, data = null) => {
    errorResponse(res, message, 401, data);
  };
  
  export const errorResponse403 = (res, message, data = null) => {
    errorResponse(res, message, 403, data);
  };
  
  // Additional error response for 500 (Internal Server Error)
  export const errorResponse500 = (res, message = 'Internal Server Error', data = null) => {
    errorResponse(res, message, 500, data);
  };
  