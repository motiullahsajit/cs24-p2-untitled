import { Request, Response } from 'express';
import Tracker from '../models/tracker.js';

export const getAllTrackers = async (req: Request, res: Response) => {
    try {
        const trackers = await Tracker.find();
        res.status(200).json(trackers);
    } catch (error) {
        console.error('Error fetching trackers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createTracker = async (req: Request, res: Response) => {
    try {
        const { mac, name, count } = req.body;

        const newTracker = new Tracker({
            mac,
            name,
            count,
        });

        const savedTracker = await newTracker.save();

        res.status(201).json(savedTracker);
    } catch (error) {
        console.error('Error creating tracker:', error);
        res.status(500).json({ error: 'Failed to create tracker' });
    }
};

export const updateTrackerName = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const tracker = await Tracker.findByIdAndUpdate(
            id,
            { name },
            { new: true }
        );

        if (!tracker) {
            return res.status(404).json({ message: 'Tracker not found' });
        }

        res.status(200).json(tracker);
    } catch (error) {
        console.error('Error updating tracker name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
