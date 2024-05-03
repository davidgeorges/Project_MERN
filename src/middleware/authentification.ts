import jwt from "jsonwebtoken";
import { Request, Response, Function } from "express";

/**
     * Token filter
     * @param req
     * @param res
     * @param next
     */
export const tokenFilter = async (req: Request, res: Response, next: Function) => {

  const responseBody = { message: "" };
  
  const isAuthRequest = req.originalUrl.toUpperCase().includes("AUTH");
  if (isAuthRequest) return next();

  const accessToken = req.cookies?.accessToken;
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)
      return next();
    } catch (error) {
      responseBody.message = error.name === "TokenExpiredError" ? "Error: access token expired." : "Error: an error occurred while trying to authenticate.";
    }
  } else {
    responseBody.message = "Error: missing access token.";
  }
  
  return res.status(responseBody.message.includes('token') ? 401 : 500).json(responseBody);
};


