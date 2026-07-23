const URL_REGEX = /^(https?:\/\/)([\w.-]+)(:\d+)?(\/[^\s]*)?$/;

export function isValidUrl(value) {
  return URL_REGEX.test(value);
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
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
