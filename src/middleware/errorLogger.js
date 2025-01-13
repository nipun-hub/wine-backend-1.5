import { logErrorToDatabase } from "../util/errorUtil.js";

// Global error logger middleware
export const errorLogger = async (err, req, res, next) => {
  // Log the error details to the database
  try {
    await logErrorToDatabase(err, req);
  } catch (logError) {
    console.error('Failed to log error to the database', logError);
  }

  // Send an error response to the client
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

