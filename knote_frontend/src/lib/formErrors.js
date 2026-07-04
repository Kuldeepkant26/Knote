import { ApiError } from "./apiClient";

/**
 * Normalizes an error thrown by the API layer into a shape the auth forms
 * can render: per-field messages inline, everything else as a top banner.
 *
 * @param {unknown} err
 * @returns {{ fieldErrors: Record<string,string>, formError: string }}
 */
export function toFormErrors(err) {
  const fieldErrors = {};
  let formError = "";

  if (err instanceof ApiError) {
    if (Array.isArray(err.errors) && err.errors.length > 0) {
      for (const { field, message } of err.errors) {
        if (field) fieldErrors[field] = message;
        else formError = message;
      }
      // If validation errors existed but none had a field, fall back to the message.
      if (!formError && Object.keys(fieldErrors).length === 0) {
        formError = err.message;
      }
    } else {
      formError = err.message;
    }
  } else {
    formError = "Something went wrong. Please try again.";
  }

  return { fieldErrors, formError };
}
