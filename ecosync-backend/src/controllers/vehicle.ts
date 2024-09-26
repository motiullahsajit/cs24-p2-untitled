import { Request, Response } from "express";
import Vehicle from "../models/vehicle.js";

export const createVehicle = async (req: Request, res: Response) => {
  const { registrationNumber, type, capacity, fuelCostPerKilometer } = req.body;

  try {
    const newVehicle = new Vehicle({
      registrationNumber,
      type,
      capacity,
      fuelCostPerKilometer,
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { registrationNumber, type, capacity, fuelCostPerKilometer } = req.body;

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { registrationNumber, type, capacity, fuelCostPerKilometer },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(updatedVehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
