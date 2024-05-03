import { Request, Response, Function } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import JwtInterface from "../interfaces/jwtInterface";
import mongoose from "mongoose";
import { Event } from "../models/events";

/**
 * Logique de nos différente routes
 */
class UserController {
  /**
   * Permet de récuperer la liste des users
   * @param req
   * @param res
   * @param next
   */
  findAll = async (req: Request, res: Response, next: Function) => {
    try {
      res.status(200).json({ message: "Users fetched successfully", payload: await User.find() });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Récupération d'un user par son ID
   * @param req
   * @param res
   * @param next
   */
  findById = async (req: Request, res: Response, next: Function) => {
    try {
      const event = await User.findById(req.params.id);
      res.status(event ? 200 : 404).send({ message: event ? "User fetched successfully" : "No user found with this id", payload: event })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  };

  /**
   * Mise à jour d'un user
   * @param req
   * @param res
   * @returns
   */
  update = async (req: Request, res: Response) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(updatedUser ? 200 : 404).send({ message: updatedUser ? "User updated successfully" : "No user found with this id", payload: updatedUser })
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        res.status(400).json({ message: 'Duplicate data' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  /**
   * Effacer un user
   * @param req
   * @param res
   * @param next
   */
  delete = async (req: Request, res: Response, next: Function) => {
    try {
      const deletedEvent = await User.findByIdAndDelete(req.params.id)
      res.status(deletedEvent ? 204 : 404).send({ message: deletedEvent ? "User deleted successfully" : "No user to delete found with this id ", })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  subscribeToAnEvent = async (req: Request, res: Response, next: Function) => {
    const accessToken = req.cookies?.accessToken;
    const jwtData = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;
    const session = await mongoose.startSession();
    const eventId = req.params.id;

    try {
      session.startTransaction();
      const userId = jwtData.userId;
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);

      if (!user || !event) {
        return res.status(404).json({ message: 'User or Event not found.' });
      }

      if (user.subscribedEvent.includes(eventId)) {
        return res.status(409).json({ message: 'Event already exists in user subscribedEvent list.' });
      }

      await User.findOneAndUpdate(
        { _id: userId, subscribedEvent: { $ne: eventId } },
        { $push: { subscribedEvent: eventId } }
      );

      await Event.findOneAndUpdate(
        { _id: eventId },
        { $push: { subscriber: userId } }
      );

      await session.commitTransaction();
      res.status(201).json({ message: 'Subscribed to event successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };



  unsubscribeFromAnEvent = async (req: Request, res: Response, next: Function) => {
    const accessToken = req.cookies?.accessToken;
    const jwtData = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;
    const session = await mongoose.startSession();
    const eventId = req.params.id;

    try {
      session.startTransaction();
      const userId = jwtData.userId;
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);

      if (!user || !event) {
        return res.status(404).json({ message: 'User or Event not found.' });
      }

      if (!user.subscribedEvent.includes(eventId)) {
        return res.status(404).json({ message: 'Event not found in user subscribedEvent list.'});
      }

      await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { subscribedEvent: eventId } }
      );

      await Event.findOneAndUpdate(
        { _id: eventId },
        { $pull: { subscriber: userId } }
      );

      await session.commitTransaction();
      res.status(200).json({ message: 'Unsubscribed from event successfully' });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };


}

export const userController = Object.freeze(new UserController());
