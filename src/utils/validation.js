const URL_REGEX = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/[^\s]*)?$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidUrl(value) {
  return URL_REGEX.test(value);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

export function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 6;
}

export function validateService(service) {
  const errors = {};

  if (!isNonEmptyString(service.name)) {
    errors.name = 'Service name is required.';
  }

  if (!isNonEmptyString(service.url)) {
    errors.url = 'Service URL is required.';
  } else if (!isValidUrl(service.url)) {
    errors.url = 'Enter a valid URL starting with http:// or https://.';
  }

  if (!isNonEmptyString(service.type)) {
    errors.type = 'Service type is required.';
  }

  return errors;
}

export function validateAuth({ email, password, confirmPassword }) {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
