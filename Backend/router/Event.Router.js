import express from 'express';
import dotenv from 'dotenv';
import { addEvent, checkEventComplete, deleteEvent, readAllEvent, readOurEvent, updateEvent } from '../controller/Event.Controller.js';
import { body, check } from 'express-validator';

// for env file
dotenv.config();

// create event router
export const eventRouter = express.Router();

// VALIDATION FOR EVENT
const validateEvent = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required.')
        .isString().withMessage('Title must be a string.'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required.')
        .isString().withMessage('Description must be a string.'),

    body('date')
        .isISO8601().withMessage('Date must be a valid ISO 8601 date.')
        .toDate(), // Converts string to Date object

    body('time')
        .trim()
        .notEmpty().withMessage('Time is required.')
        .matches(/^(0[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i).withMessage('Time must be in HH:MM AM/PM format.'),


    body('location')
        .trim()
        .notEmpty().withMessage('Location is required.')
        .isString().withMessage('Location must be a string.'),

    body('capacity')
        .isInt({ min: 0 }).withMessage('Capacity must be a non-negative integer.')
];


// ADD NEW EVENT
eventRouter.post(process.env.ADD_EVENT, validateEvent, addEvent);

// UPDATE EVENT
eventRouter.put(process.env.UPDATE_EVENT, validateEvent, updateEvent )

// READ OUR EVENT
eventRouter.post(process.env.OUR_EVENT, readOurEvent);

// READ ALL THE EVENT
eventRouter.get(process.env.ALL_EVENTS, readAllEvent);

// DELETE PARTICULAR EVENT
eventRouter.delete(process.env.DELETE_EVENT, deleteEvent);

// CHECK EVENT COMPLETE OR NOT
eventRouter.post(process.env.CHECK_EVENTCOMPLETE, checkEventComplete);