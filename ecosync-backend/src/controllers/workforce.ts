import { Request, Response } from "express";
import Workforce from "../models/workforce.js";

export const getAllWorkforce = async (req: Request, res: Response) => {
    try {
        const workforce = await Workforce.find();
        res.status(200).json(workforce);
    } catch (error) {
        console.error("Error fetching workforce:", error);
        res.status(500).json({ message: "Failed to fetch workforce" });
    }
};

export const createWorkforce = async (req: Request, res: Response) => {
    try {
        const newWorkforce = new Workforce(req.body);
        const savedWorkforce = await newWorkforce.save();
        res.status(201).json(savedWorkforce);
    } catch (error) {
        console.error("Error creating workforce:", error);
        res.status(500).json({ message: "Failed to create workforce" });
    }
};

export const updateWorkforceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedWorkforce = await Workforce.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedWorkforce) {
            return res.status(404).json({ message: "Workforce not found" });
        }

        res.status(200).json({
            message: "Workforce updated successfully",
            updatedWorkforce,
        });
    } catch (error) {
        console.error("Error updating workforce:", error);
        res.status(500).json({ message: "Failed to update workforce" });
    }
};

export const deleteWorkforceById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedWorkforce = await Workforce.findByIdAndDelete(id);

        if (!deletedWorkforce) {
            return res.status(404).json({ message: "Workforce not found" });
        }

        res.status(200).json({ message: "Workforce deleted successfully" });
    } catch (error) {
        console.error("Error deleting workforce:", error);
        res.status(500).json({ message: "Failed to delete workforce" });
    }
};
