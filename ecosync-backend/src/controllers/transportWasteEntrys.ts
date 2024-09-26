import { Request, Response } from "express";
import TransportedWasteEntry from "../models/transportWasteEntrys.js";

export const createTransportedWasteEntry = async (req: Request, res: Response) => {
    try {
        const {
            timeAndDateOfCollection,
            amountCollectedKg,
            contractorId,
            typeOfWaste,
            designatedSTS,
            vehicleUsed
        } = req.body;

        const newEntry = new TransportedWasteEntry({
            timeAndDateOfCollection,
            amountCollectedKg,
            contractorId,
            typeOfWaste,
            designatedSTS,
            vehicleUsed
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getAllTransportedWasteEntries = async (_: Request, res: Response) => {
    try {
        const entries = await TransportedWasteEntry.find();
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const updateTransportedWasteEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            timeAndDateOfCollection,
            amountCollectedKg,
            contractorId,
            typeOfWaste,
            designatedSTS,
            vehicleUsed
        } = req.body;

        const updatedEntry = await TransportedWasteEntry.findByIdAndUpdate(
            id,
            {
                timeAndDateOfCollection,
                amountCollectedKg,
                contractorId,
                typeOfWaste,
                designatedSTS,
                vehicleUsed
            },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: "Transported waste entry not found" });
        }

        res.status(200).json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const deleteTransportedWasteEntry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedEntry = await TransportedWasteEntry.findByIdAndDelete(id);

        if (!deletedEntry) {
            return res.status(404).json({ message: "Transported waste entry not found" });
        }

        res.status(200).json({ message: "Transported waste entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
