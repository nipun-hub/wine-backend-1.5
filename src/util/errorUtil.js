import ErrorLog from "../model/ErrorLog.js";

// Log error to the database (used in middleware)
export const logErrorToDatabase = async (err, req) => {
  try {
    const errorLog = new ErrorLog({
      message: err.message || 'No error message provided',
      statusCode: err.statusCode || 500,
      data: {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
        body: req.body,
      },
    });
    await errorLog.save();
  } catch (logError) {
    console.error('Failed to log error to the database', logError);
  }
};
