import type { RequestHandler } from "express";
import { unauthorized } from "../shared/http.js";

export const requireAuth: RequestHandler = (request, _response, next) => {
  if (!request.user) {
    next(unauthorized());
    return;
  }

  next();
};
