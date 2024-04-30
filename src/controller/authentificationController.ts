import { Request, Response, Function } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Logique de nos différente routes
 */
class AuthentificatonController {
    /**
     * Regiser user
     * @param req
     * @param res
     * @param next
     */
    register = async (req: Request, res: Response, next: Function) => {
        try {
            res.status(201).json({ message: "User created successfully", payload: await new User(req.body).save() });
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                res.status(400).json({ message: 'Duplicate data' });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };

    /**
     * Login user
     * @param req
     * @param res
     * @param next
     */
    login = async (req: Request, res: Response, next: Function) => {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user) {
                return res.status(401).json({ message: "No user is registered with this email." });
            }

            const customKey = process.env.PASSWORD_KEY
            const passwordIsValid = await bcrypt.compare(req.body.password+customKey, user.password);

            if (!passwordIsValid) {
                return res.status(401).json({ message: "Wrong credentials info." });
            }

            const payload = {
                id: user.id,
                role: user.role,
                email: user.email
            };

            const accessToken = jwt.sign({ userId: user.id, userRole: user.role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
            res.cookie("accessToken", accessToken, { httpOnly: true });

            return res.status(200).json({ message: "Logged in with success.", payload });
        } catch (error) {
            return res.status(500).end();
        }
    };

    /**
     * Logout user
     * @param req
     * @param res
     * @param next
     */
    logout = async (req: Request, res: Response, next: Function) => {
        res.clearCookie("accessToken")
        res.status(204).end();
    };

}

export const authentificationController = Object.freeze(new AuthentificatonController());

