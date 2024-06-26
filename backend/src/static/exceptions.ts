export const EXCEPTIONS = {
  REQUIRED: "This field is required",
  FIELD_REQUIRED: (field: string) => `${field} is required`,
  USER_ALREADY_EXISTS: "User already exists",
  NOT_AUTHORIZED: "User not authorized",
  SERVER_ERROR: "Unexpected Error",
  ONLY_ATHLETE: "Only athletes can access this feature",
  VALIDATION_ERROR: "Validation Error",
};
