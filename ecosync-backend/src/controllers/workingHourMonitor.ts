import { Request, Response } from "express";
import LoggedWorkingHours from "../models/loggedWorkingHour.js";

export const createLoggedWorkingHours = async (req: Request, res: Response) => {
    try {
        const {
            logInTime,
            logOutTime,
            totalHoursWorked,
            overtimeHours,
            absencesAndLeaves
        } = req.body;

        const newLoggedWorkingHours = new LoggedWorkingHours({
            logInTime,
            logOutTime,
            totalHoursWorked,
            overtimeHours,
            absencesAndLeaves
        });

        const savedLoggedWorkingHours = await newLoggedWorkingHours.save();

        res.status(201).json(savedLoggedWorkingHours);
    } catch (error) {
        console.error("Error creating logged working hours record:", error);
        res.status(500).json({ message: "Failed to create logged working hours record" });
    }
};

export const getAllLoggedWorkingHours = async (
    req: Request,
    res: Response
) => {
    try {
        const loggedWorkingHours = await LoggedWorkingHours.find();
        res.status(200).json(loggedWorkingHours);
    } catch (error) {
        console.error("Error fetching logged working hours records:", error);
        res.status(500).json({ message: "Failed to fetch logged working hours records" });
    }
};

export const updateLoggedWorkingHoursById = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedLoggedWorkingHours = await LoggedWorkingHours.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedLoggedWorkingHours) {
            return res.status(404).json({ message: "Logged working hours record not found" });
        }

        res.status(200).json(updatedLoggedWorkingHours);
    } catch (error) {
        console.error("Error updating logged working hours record:", error);
        res.status(500).json({ message: "Failed to update logged working hours record" });
    }
};

export const deleteLoggedWorkingHoursById = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    try {
        const deletedLoggedWorkingHours = await LoggedWorkingHours.findByIdAndDelete(id);

        if (!deletedLoggedWorkingHours) {
            return res.status(404).json({ message: "Logged working hours record not found" });
        }

        res.status(200).json({ message: "Logged working hours record deleted successfully" });
    } catch (error) {
        console.error("Error deleting logged working hours record:", error);
        res.status(500).json({ message: "Failed to delete logged working hours record" });
    }
};
