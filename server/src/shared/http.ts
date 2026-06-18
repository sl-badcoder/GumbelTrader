export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
  }
}

export function badRequest(message: string): HttpError {
  return new HttpError(400, message);
}

export function unauthorized(message = "Authentication required"): HttpError {
  return new HttpError(401, message);
}

export function conflict(message: string): HttpError {
  return new HttpError(409, message);
}
