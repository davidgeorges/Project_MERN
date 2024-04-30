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
      res.status(200).send({ message: "Event fetched successfully", payload: await Event.findById(req.params.id) })
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
      if (error.name === 'MongoServerError' && error.code === 11000) {
        res.status(400).json({ message: 'Duplicate data' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
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
      const updatedUser = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      ); // {new: true} pour retourner l'objet mis à jour
      if (!updatedUser) {
        return res.status(404).send({ message: "Utilisateur non trouvé" });
      }
      res.status(200).send(updatedUser);
    } catch (error) {
      console.error("Erreur de mise à jour :", error);
      res.status(500).send({ error: "Erreur interne du serveur" });
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
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export const eventController = Object.freeze(new EventController());
