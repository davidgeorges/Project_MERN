import { Request, Response, Function } from "express";
import { Event } from "../models/events";

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
    try {
      res.status(201).json({ message: "Event created successfully", payload: await new Event(req.body).save() });
    } catch (error) {
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
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id)
      res.status(deletedEvent ? 204 : 404).send({ message: deletedEvent ? "Event deleted successfully" : "No event to delete found with this id ", })
    } catch (error) {
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
          return a.users.length - b.users.length;
        } else if (orderBy === 'desc') {
          return b.users.length - a.users.length;
        } else {
          return b.users.length - a.users.length;
        }
      });

      res.status(200).json({ message: "Events fetched successfully", payload: events });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

}

export const eventController = Object.freeze(new EventController());
