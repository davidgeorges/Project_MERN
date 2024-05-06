import { Request, Response, Function } from "express";
import { Event } from "../models/events";
import jwt from "jsonwebtoken";
import JwtInterface from "../interfaces/jwtInterface";
import { User } from "../models/user";
import mongoose from "mongoose";

/**
 * Logique de nos différente routes
 */
class EventController {
  /**
   * Permet de récuperer la liste des events
   * @param req
   * @param res
   * @param next
   */
  findAll = async (req: Request, res: Response, next: Function) => {
    try {
      res.status(200).json({ message: "Events fetched successfully", payload: await Event.find() });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Récupération d'un event par son ID
   * @param req
   * @param res
   * @param next
   */
  findById = async (req: Request, res: Response, next: Function) => {
    try {
      const event = await Event.findById(req.params.id);
      res.status(event ? 200 : 404).send({ message: event ? "Event fetched successfully" : "No user found with this id", payload: event })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  };

  /**
   * Creation d'un event
   * @param req
   * @param res
   * @param next
   */
  create = async (req: Request, res: Response, next: Function) => {

    const accessToken = req.cookies?.accessToken;
    const jwtData = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      req.body.owner = jwtData.userId;
      const newEvent = await new Event(req.body).save();
      const userId = jwtData.userId;
      const eventId = newEvent._id;

      await User.findOneAndUpdate(
        { _id: userId },
        { $push: { eventHeld: eventId } }
      );

      await session.commitTransaction();
      res.status(201).json({ message: 'Event created successfully', newEvent });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Mise à jour d'un event
   * @param req
   * @param res
   * @returns
   */
  update = async (req: Request, res: Response) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(updatedEvent ? 200 : 404).send({ message: updatedEvent ? "Event updated successfully" : "No event found with this id", payload: updatedEvent })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
   * Effacer un event
   * @param req
   * @param res
   * @param next
   */
  delete = async (req: Request, res: Response, next: Function) => {

    const accessToken = req.cookies?.accessToken;
    const jwtData = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET) as JwtInterface;

    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const deletedEvent = await Event.findByIdAndDelete(req.params.id)

      if (!deletedEvent) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'No event found with this id' });
      }

      await User.findByIdAndUpdate(
        jwtData.userId,
        { $pull: { eventHeld: deletedEvent._id } },
        { session }
      );

      await session.commitTransaction();

      res.status(204).end();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  sortByDate = async (req: Request, res: Response, next: Function) => {
    try {
      const events = await Event.find();

      let orderBy = req.params.orderBy;
      orderBy = orderBy === 'desc' ? -1 : 1;

      const filteredEvents = events.filter(event => event.date);
      filteredEvents.sort((a, b) => {
        if (!a.date || !b.date) return 0;
        return orderBy * (a.date.getTime() - b.date.getTime());
      });

      res.status(200).json({ message: "Events fetched successfully", payload: filteredEvents });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  sortByType = async (req: Request, res: Response, next: Function) => {
    try {
      const events = await Event.find();

      const orderType = req.params.orderType;

      const defaultTypeOrder = ['CONFERENCE', 'CONCERT', 'PRIVATE MEETING'];

      events.sort((a, b) => {
        if (a.type === orderType && b.type !== orderType) return -1;
        if (a.type !== orderType && b.type === orderType) return 1;
        return defaultTypeOrder.indexOf(a.type) - defaultTypeOrder.indexOf(b.type);
      });

      res.status(200).json({ message: "Events fetched successfully", payload: events });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  sortByPopularity = async (req: Request, res: Response, next: Function) => {
    try {
      const events = await Event.find();

      const orderBy = req.params.orderBy;

      events.sort((a, b) => {
        if (orderBy === 'asc') {
          return a.subscriber.length - b.subscriber.length;
        } else if (orderBy === 'desc') {
          return b.subscriber.length - a.subscriber.length;
        } else {
          return b.subscriber.length - a.subscriber.length;
        }
      });

      res.status(200).json({ message: "Events fetched successfully", payload: events });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

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
        return res.status(404).json({ message: 'Event not found in user subscribedEvent list.' });
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

export const eventController = Object.freeze(new EventController());
