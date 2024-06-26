import { Request, Response, Function } from "express";
import { User } from "../models/user";

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
      res.status(200).json({ message: "Users fetched successfully", payload: await User.find().select('-password -role') });
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
      const event = await User.findById(req.params.id).select('-password -email -role');
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
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -role');
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

}

export const userController = Object.freeze(new UserController());
