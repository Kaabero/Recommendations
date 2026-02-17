import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "./logger";
import User from "../models/user";
import { CustomRequest } from "../../types";

const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "Unknown endpoint" });
};

const errorHandler = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  logger.error(error);

  if (error instanceof Error && error.name === "CastError") {
    return response.status(400).send({ error: "Malformatted id" });
  } else if (error instanceof Error && error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error instanceof Error &&
    error.name === "SequelizeValidationError"
  ) {
    return response.status(400).json({ error: error.message });
  } else if (error instanceof Error && error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "Token missing or invalid" });
  } else if (error instanceof Error && error.name === "TokenExpiredError") {
    return response.status(401).json({ error: "Token expired" });
  }

  next(error);
};

const tokenExtractor = (
  request: CustomRequest,
  response: Response,
  next: NextFunction,
) => {
  const authorization = request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }

  next();
};

const userExtractor = async (
  request: CustomRequest,
  response: Response,
  next: NextFunction,
) => {
  const secret = process.env.SECRET;
  if (!secret) {
    response
      .status(500)
      .json({ error: "SECRET is not defined in environment" });
    return;
  }

  const decodedToken = jwt.verify(
    request.token ?? "",
    secret,
  ) as jwt.JwtPayload;
  if (!decodedToken.id) {
    request.user = null;
  } else {
    request.user = await User.findByPk(decodedToken.id);
  }

  next();
};

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
