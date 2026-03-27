export const parseRequest = (schema, payload) => schema.safeParse(payload);

export const sendValidationError = (res, error) =>
  res.status(400).json({
    message: "Validation failed",
    errors: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  });
