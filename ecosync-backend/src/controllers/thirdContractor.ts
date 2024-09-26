import { Request, Response } from "express";
import thirdContractor from "../models/thirdContractor.js";

export const getAllThirdPartyContractors = async (
    req: Request,
    res: Response
) => {
    try {
        const thirdContractors = await thirdContractor.find();
        res.status(200).json(thirdContractors);
    } catch (error) {
        console.error("Error fetching third-party contractors:", error);
        res
            .status(500)
            .json({ message: "Failed to fetch third-party contractors" });
    }
};

export const createThirdPartyContractor = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            companyName,
            contractId,
            registrationId,
            registrationDate,
            tin,
            contactNumber,
            workforceSize,
            paymentPerTonnage,
            requiredAmountPerDay,
            contractDuration,
            areaOfCollection,
            designatedSTS,
        } = req.body;

        const newThirdContractor = new thirdContractor({
            companyName,
            contractId,
            registrationId,
            registrationDate,
            tin,
            contactNumber,
            workforceSize,
            paymentPerTonnage,
            requiredAmountPerDay,
            contractDuration,
            areaOfCollection,
            designatedSTS,
        });

        const savedThirdContractor = await newThirdContractor.save();

        res.status(201).json(savedThirdContractor);
    } catch (error) {
        console.error("Error creating third-party contractor:", error);
        res
            .status(500)
            .json({ message: "Failed to create third-party contractor" });
    }
};

export const updateThirdPartyContractorById = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedThirdContractor = await thirdContractor.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedThirdContractor) {
            return res
                .status(404)
                .json({ message: "Third-party contractor not found" });
        }

        res.status(200).json({
            message: "Third-party contractor updated successfully",
            updatedThirdContractor,
        });
    } catch (error) {
        console.error("Error updating third-party contractor:", error);
        res
            .status(500)
            .json({ message: "Failed to update third-party contractor" });
    }
};

export const deleteThirdPartyContractorById = async (
    req: Request,
    res: Response
) => {
    const { id } = req.params;

    try {
        const deletedThirdContractor = await thirdContractor.findByIdAndDelete(id);

        if (!deletedThirdContractor) {
            return res
                .status(404)
                .json({ message: "Third-party contractor not found" });
        }

        res
            .status(200)
            .json({ message: "Third-party contractor deleted successfully" });
    } catch (error) {
        console.error("Error deleting third-party contractor:", error);
        res
            .status(500)
            .json({ message: "Failed to delete third-party contractor" });
    }
};
