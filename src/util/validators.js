// Check if a field is provided and not empty
export const isRequired = (value) => {
  return value !== undefined && value !== null && value !== "";
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate string length
export const isStringLengthValid = (value, min, max) => {
  return value.length >= min && value.length <= max;
};
