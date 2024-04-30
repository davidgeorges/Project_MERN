import { body, validationResult } from "express-validator";
import {Request, Response} from 'express';
import bcrypt from "bcrypt";

export const newUser = [
    body("firstName")
        .notEmpty().withMessage("The firstName field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The firstname must contain only letters.")
        .isLength({ min: 2, max: 24 })
        .withMessage("The firstname must be between 2 and 24 characters.")
        .toUpperCase(),
    body("lastName")
        .notEmpty().withMessage("The lastName field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The lastname must contain only letters.")
        .isLength({ min: 2, max: 24 })
        .withMessage("The lastname must be between 2 and 24 characters.")
        .toUpperCase(),
    body("email")
        .notEmpty().withMessage("The email field is required")
        .isEmail()
        .withMessage("Invalid email.")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters.")
        .normalizeEmail({ gmail_remove_dots: false }),
    body("password")
        .notEmpty().withMessage("The password field is required")
        .isStrongPassword()
        .withMessage("The password must be at least 8 characters long and must contain: 1 UPPERCASE letter, 1 MINIMUM letter, 1 number and 1 special character.")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters.")
        .customSanitizer(async (passwordReceive) => {
            return await bcrypt.hash(passwordReceive, 10);
        }),
    body("role")
        .notEmpty().withMessage("The role field is required")
        .isIn(['USER', 'MANAGER'])
        .withMessage("You can only create an account for user."),
    (req: Request, res: Response, next: Function) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            return next();
        }
    },
];

export const editUser = [
    body("firstName")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The firstname must contain only letters.")
        .isLength({ min: 2, max: 24 })
        .withMessage("The firstname must be between 2 and 24 characters.")
        .toUpperCase()
        .optional(),
    body("lastName")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The lastname must contain only letters.")
        .isLength({ min: 2, max: 24 })
        .withMessage("The lastname must be between 2 and 24 characters.")
        .toUpperCase()
        .optional(),
    body("email")
        .isEmail()
        .withMessage("Invalid email.")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters.")
        .normalizeEmail({ gmail_remove_dots: false })
        .optional(),
    body("password")
        .isStrongPassword()
        .withMessage("The password must be at least 8 characters long and must contain: 1 UPPERCASE letter, 1 MINIMUM letter, 1 number and 1 special character.")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters.")
        .customSanitizer(async (passwordReceive) => {
            return await bcrypt.hash(passwordReceive, 10);
        }).optional(),
    (req: Request, res: Response, next: Function) : void => {

        if (Object.keys(req.body).length === 0) return res.status(400).json({ "message": "The request body is empty, no value to update." });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            return next();
        }
    },
];

export const newEvent = [
    body("title")
        .notEmpty().withMessage("The title field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The title must contain only letters.")
        .isLength({ min: 20, max: 100 })
        .withMessage("The title must be between 20 and 100 characters.")
        .toUpperCase(),
    body("description")
        .notEmpty().withMessage("The description field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The description must contain only letters.")
        .isLength({ min: 200, max: 2400 })
        .withMessage("The title must be between 200 and 2400 characters.")
        .toUpperCase(),
    body("city")
        .notEmpty().withMessage("The city field is required")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters."),
    body("type")
        .notEmpty().withMessage("The type field is required")
        .isIn(["CONFERENCE", "CONCERT", "PRIVATE MEETING"])
        .withMessage("You can type from those value ['CONFERENCE', 'CONCERT', 'PRIVATE MEETING']"),
    (req: Request, res: Response, next: Function) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            return next();
        }
    },
];

export const editEvent = [
    body("title")
        .notEmpty().withMessage("The title field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The title must contain only letters.")
        .isLength({ min: 20, max: 100 })
        .withMessage("The title must be between 20 and 100 characters.")
        .toUpperCase(),
    body("description")
        .notEmpty().withMessage("The description field is required")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .withMessage("The description must contain only letters.")
        .isLength({ min: 200, max: 2400 })
        .withMessage("The title must be between 200 and 2400 characters.")
        .toUpperCase(),
    body("city")
        .notEmpty().withMessage("The city field is required")
        .isLength({ max: 255 })
        .withMessage("Maximum 255 characters."),
    body("type")
        .notEmpty().withMessage("The type field is required")
        .isIn(["CONFERENCE", "CONCERT", "PRIVATE MEETING"])
        .withMessage("You can type from those value ['CONFERENCE', 'CONCERT', 'PRIVATE MEETING']"),
    (req : Request, res: Response, next: Function) => {
        const errors  = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            return next();
        }
    },
];

