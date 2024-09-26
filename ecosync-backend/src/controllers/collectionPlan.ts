import { Request, Response } from "express";
import CollectionPlan from "../models/collectionPlan.js";

export const createCollectionPlan = async (req: Request, res: Response) => {
    try {
        const {
            areaOfCollection,
            collectionStartTime,
            duration,
            numberOfLaborers,
            numberOfVans,
            expectedWeightOfSolidWaste,
        } = req.body;

        const newCollectionPlan = new CollectionPlan({
            areaOfCollection,
            collectionStartTime,
            duration,
            numberOfLaborers,
            numberOfVans,
            expectedWeightOfSolidWaste,
        });

        const savedCollectionPlan = await newCollectionPlan.save();

        res.status(201).json(savedCollectionPlan);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const getAllCollectionPlans = async (req: Request, res: Response) => {
    try {
        const collectionPlans = await CollectionPlan.find();
        res.status(200).json(collectionPlans);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const updateCollectionPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCollectionPlan = await CollectionPlan.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedCollectionPlan);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export const deleteCollectionPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await CollectionPlan.findByIdAndDelete(id);
        res.status(200).json({ message: "Collection plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};
