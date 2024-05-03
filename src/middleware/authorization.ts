import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import JwtInterface from '../interfaces/jwtInterface';
import { Event } from '../models/events';

export const isAuthorized = (userRoles: string[]) => async (request: Request, response: Response, next: NextFunction) => {
   const accessToken = request.cookies.accessToken;

   if (request.originalUrl.toUpperCase().split("/").includes("AUTH")) return next();

   try {
      const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;
      if (userRoles.includes(decodedAccessToken.userRole)) return next();
      return response.status(403).json({ "message": 'Error: you cannot access this route.' });
   } catch (error) {
      return response.status(401).json({ "message": 'Error: access token is expired.' });
   }
};

export const isOwner = async (request: Request, response: Response, next: NextFunction) => {
   try {
      const { userId, userRole } = jwt.verify(request.cookies.accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;
      if (userRole === 'ADMIN') return next();

      if (request.originalUrl.toUpperCase().split("/").includes("EVENT")) {
         const event = await Event.findOne({ owner: userId, _id: request.params.id });
         if(event) return next();
      } else {
         const isAuthorized = userId === request.params.id;
         if (isAuthorized) return next();
      }

      return response.status(403).json({ message: 'You can only access your own resource.' });
   } catch (error) {
      return response.status(401).json({ message: 'Error: access token is expired.' });
   }
};

