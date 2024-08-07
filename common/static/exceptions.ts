export const EXCEPTIONS = {
  REQUIRED: "This field is required",
  FIELD_REQUIRED: (field: string) => `${field} is required`,
  ITEM_EXISTS: (name: string) => `${name} already exists`,
  ITEM_NOT_FOUND: (name: string) => `${name} not found`,
  USER_EMAIL_ALREADY_REGISTERED: "User with given email already exists",
  ORGANIZATION_NOT_EXISTS: "Organization not found",
  NOT_AUTHORIZED: "User not authorized",
  FORBIDDEN: "Forbidden",
  SERVER_ERROR: "Something went wrong",
  REQUEST_ERROR: "Unexpected Error",
  ONLY_ATHLETE: "Only athletes can access this feature",
  VALIDATION_ERROR: "Validation Error",
  USER_NOT_ACTIVE: "User not allowed",
  CHAT_CLOSED: "This chat is closed, create a new one to continue.",
  SIGN_IN_INVALID: "Invalid email or password",
};

export const EXCEPTION_CODE = {
  EXPIRED_TOKEN: "auth/id-token-expired",
  INVALID_CREDENTIALS: 'auth/invalid-credential'
};
