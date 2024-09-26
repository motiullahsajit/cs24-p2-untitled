import axios from "axios";
import { Request, Response } from "express";
import STS from "../models/sts.js";
import Vehicle from "../models/vehicle.js";
import VehicleEntry from "../models/vehicle-entry.js";
import Landfill from "../models/landfill.js";
import User from "../models/user.js";
import ContractorBill from "../models/contractor-bill.js";

export const createSTS = async (req: Request, res: Response) => {
  try {
    const { stsId, wardNumber, capacity, location, managers, trucks } =
      req.body;
    const newSTS = await STS.create({
      stsId,
      wardNumber,
      capacity,
      location,
      managers,
      trucks,
    });
    res.status(201).json(newSTS);
  } catch (error) {
    console.error("Error creating STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllSTS = async (req: Request, res: Response) => {
  try {
    const sts = await STS.find();
    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }
    res.status(200).json(sts);
  } catch (error) {
    console.error("Error getting STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSTSById = async (req: Request, res: Response) => {
  try {
    const stsId = req.params.stsId;
    const sts = await STS.findById(stsId);
    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }
    res.status(200).json(sts);
  } catch (error) {
    console.error("Error getting STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateSTS = async (req: Request, res: Response) => {
  try {
    const _id = req.params.stsId;
    const { stsId, wardNumber, capacity } = req.body;

    const updatedFields: any = {};

    if (capacity !== undefined) {
      updatedFields.capacity = capacity;
    }

    if (stsId !== undefined) {
      updatedFields.stsId = stsId;
    }

    if (wardNumber !== undefined) {
      updatedFields.wardNumber = wardNumber;
    }

    if (Object.keys(req.body).length > Object.keys(updatedFields).length) {
      return res.status(400).json({
        message: "Only stsId, wardNumber, and capacity can be updated",
      });
    }

    const updatedSTS = await STS.findByIdAndUpdate(_id, updatedFields, {
      new: true,
    });

    if (!updatedSTS) {
      return res.status(404).json({ message: "STS not found" });
    }

    res.status(200).json(updatedSTS);
  } catch (error) {
    console.error("Error updating STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteSTS = async (req: Request, res: Response) => {
  try {
    const stsId = req.params.stsId;
    const deletedSTS = await STS.findByIdAndDelete(stsId);
    if (!deletedSTS) {
      return res.status(404).json({ message: "STS not found" });
    }
    res.status(200).json({ message: "STS deleted successfully" });
  } catch (error) {
    console.error("Error deleting STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUnassignedSTSManagers = async (req: Request, res: Response) => {
  try {
    const stsManagers = await User.find({ role: "sts_manager" });

    const stsCount = await STS.countDocuments();

    const stsExists = stsCount > 0;

    if (!stsExists) {
      res.status(200).json({ stsManagers });
      return;
    }

    const unassignedSTSManagers = await Promise.all(
      stsManagers.map(async (manager) => {
        const assignedSTS = await STS.findOne({ managers: manager._id });
        if (!assignedSTS) {
          return manager;
        }
      })
    );

    const filteredManagers = unassignedSTSManagers.filter(
      (manager) => manager !== undefined
    );

    res.status(200).json({ stsManagers: filteredManagers });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const assignSTSManagers = async (req: Request, res: Response) => {
  try {
    const { stsId } = req.params;
    const { managerId } = req.body;

    const existingSTS = await STS.findById(stsId);

    if (!existingSTS) {
      return res.status(404).json({ message: "STS not found" });
    }

    existingSTS.managers.push(managerId);

    const updatedSTS = await existingSTS.save();

    res.status(200).json(updatedSTS);
  } catch (error) {
    console.error("Error assigning STS managers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUnassignedVehicles = async (req: Request, res: Response) => {
  try {
    const allVehicles = await Vehicle.find();

    const allSTSs = await STS.find();

    if (allSTSs.length === 0) {
      res.status(200).json({ unassignedVehicles: allVehicles });
      return;
    }

    const assignedVehicleIds = allSTSs.flatMap((sts) =>
      sts.trucks.map((truck) => truck.toString())
    );

    const unassignedVehicles = allVehicles.filter(
      (vehicle) => !assignedVehicleIds.includes(vehicle._id.toString())
    );

    res.status(200).json({ unassignedVehicles });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const assignTrucksToSTS = async (req: Request, res: Response) => {
  try {
    const { stsId } = req.params;
    const { truckId } = req.body;

    const sts = await STS.findById(stsId);
    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }

    const truck = await Vehicle.findById(truckId);
    if (!truck) {
      return res.status(400).json({ message: "Invalid truck ID" });
    }

    if (!sts.trucks.includes(truckId)) {
      sts.trucks.push(truckId);
    }

    await sts.save();

    res.status(200).json({ message: "Truck assigned to STS successfully" });
  } catch (error) {
    console.error("Error assigning truck to STS:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSTSByManagerId = async (req: Request, res: Response) => {
  const { managerId } = req.params;

  try {
    const sts = await STS.findOne({ managers: managerId });

    if (!sts) {
      return res
        .status(404)
        .json({ message: "STS not found for this manager" });
    }

    res.status(200).json({ sts });
  } catch (error: any) {
    console.error("Error fetching STS details:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch STS details", error: error.message });
  }
};

export const getAllEntriesBySTSId = async (req: Request, res: Response) => {
  const stsId = req.params.stsID;
  try {
    const entries = await VehicleEntry.find({ stsId });
    res.json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addVehicleEntry = async (req: Request, res: Response) => {
  const {
    stsId,
    vehicleNumber,
    weightOfWaste,
    timeOfArrival,
    timeOfDeparture,
  } = req.body;

  try {
    const newEntry = new VehicleEntry({
      stsId,
      vehicleNumber,
      weightOfWaste,
      timeOfArrival,
      timeOfDeparture,
    });

    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const optimizeRoute = async (req: Request, res: Response) => {
  try {
    const { stsId, landfillId } = req.body;

    const sts = await STS.findById(stsId);
    const landfill = await Landfill.findById(landfillId);

    if (!sts || !landfill) {
      return res.status(404).json({ message: "STS or Landfill not found" });
    }
    const startLocation = `${sts.location.latitude},${sts.location.longitude}`;
    const landfillLocation = `${landfill.location.latitude},${landfill.location.longitude}`;

    const apiKey = "AIzaSyB2Yno10-YTnLjjn_Vtk0V8cdcY5lC4plU";
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${startLocation}&destination=${landfillLocation}&key=${apiKey}`;

    const response = await axios.get(apiUrl);

    const { routes } = response.data;
    const optimizedRoute = routes[0];

    res.status(200).json(optimizedRoute);
  } catch (error: any) {
    console.error("Error optimizing route:", error);
    res
      .status(500)
      .json({ message: "Failed to optimize route", error: error.message });
  }
};

export const optimizeFleet = async (req: Request, res: Response) => {
  try {
    const { landfillId, stsId } = req.body;

    const landfill = await Landfill.findById(landfillId);
    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    const sts = await STS.findById(stsId).populate("trucks");
    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }

    let totalTruckCapacity = 0;
    for (const truck of sts.trucks) {
      const vehicle = await Vehicle.findById(truck);
      if (vehicle) {
        totalTruckCapacity += vehicle.capacity;
      }
    }

    const trucksNeeded = Math.ceil(landfill.capacity / totalTruckCapacity);
    if (trucksNeeded > sts.trucks.length) {
      return res
        .status(400)
        .json({ message: "Insufficient trucks available at the STS" });
    }

    const optimalTrucks = await Promise.all(
      sts.trucks.map(async (truckId: string) => {
        const truck = await Vehicle.findById(truckId);
        return truck;
      })
    );

    optimalTrucks.sort((a: any, b: any) => {
      return a.fuelCostPerKilometer.unloaded - b.fuelCostPerKilometer.unloaded;
    });
    const slicedOptimalTrucks = optimalTrucks.slice(0, trucksNeeded);

    res.status(200).json({ optimalTrucks: slicedOptimalTrucks });
  } catch (error: any) {
    console.error("Error optimizing fleet:", error);
    res
      .status(500)
      .json({ message: "Failed to optimize fleet", error: error.message });
  }
};

export const getSTSVehicles = async (req: Request, res: Response) => {
  const { stsId } = req.params;

  try {
    const sts = await STS.findById(stsId);

    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }

    const vehicles = await Vehicle.find({ _id: { $in: sts.trucks } });

    res.status(200).json({ vehicles });
  } catch (error) {
    console.error("Error retrieving STS vehicles:", error);
    res.status(500).json({ message: "Failed to retrieve STS vehicles" });
  }
};

export const getSTSManagers = async (req: Request, res: Response) => {
  const { stsId } = req.params;

  try {
    const sts = await STS.findById(stsId);

    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }

    const managers = await User.find(
      { _id: { $in: sts.managers } },
      { password: 0 }
    );

    res.status(200).json({ managers });
  } catch (error) {
    console.error("Error retrieving STS managers:", error);
    res.status(500).json({ message: "Failed to retrieve STS managers" });
  }
};

export const getSTSOverview = async (req: Request, res: Response) => {
  const { stsId } = req.params;
  try {
    const sts = await STS.findById(stsId).populate("managers");

    if (!sts) {
      return res.status(404).json({ message: "STS not found" });
    }

    const numTrucks = sts.trucks.length;

    const recentVehicleEntries = await VehicleEntry.find({ stsId })
      .sort({ timeOfArrival: -1 })
      .limit(5);

    const totalWeight = await VehicleEntry.aggregate([
      { $match: { stsId: stsId } },
      { $group: { _id: null, totalWeight: { $sum: "$weightOfWaste" } } },
    ]);

    const avgWeightPerEntry = await VehicleEntry.aggregate([
      { $match: { stsId: stsId } },
      {
        $group: {
          _id: null,
          avgWeightPerEntry: { $avg: "$weightOfWaste" },
        },
      },
    ]);

    const totalEntries = await VehicleEntry.countDocuments({ stsId: stsId });

    const overview = {
      sts: {
        id: sts._id,
        stsId: sts.stsId,
        wardNumber: sts.wardNumber,
        capacity: sts.capacity,
        location: sts.location,
        managers: sts.managers,
        numTrucks,
      },
      recentVehicleEntries,
      statistics: {
        totalWeight: totalWeight.length > 0 ? totalWeight[0].totalWeight : 0,
        avgWeightPerEntry:
          avgWeightPerEntry.length > 0
            ? avgWeightPerEntry[0].avgWeightPerEntry
            : 0,
        totalEntries,
      },
    };

    res.status(200).json(overview);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const createBill = async (req: Request, res: Response) => {
  try {
    const newBill = new ContractorBill({
      stsId: req.body.stsId,
      contractorName: req.body.contractorName,
      weightCollected: req.body.weightCollected,
      requiredWeight: req.body.requiredWeight,
      paymentPerTon: req.body.paymentPerTon,
      fineRate: req.body.fineRate,
      basicPay: req.body.weightCollected * req.body.paymentPerTon,
      deficit: Math.max(0, req.body.requiredWeight - req.body.weightCollected),
      fine:
        Math.max(0, req.body.requiredWeight - req.body.weightCollected) *
        req.body.fineRate,
      totalBill:
        req.body.weightCollected * req.body.paymentPerTon -
        Math.max(0, req.body.requiredWeight - req.body.weightCollected) *
          req.body.fineRate,
    });

    await newBill.save();
    res.status(201).json({
      success: true,
      message: "Bill created successfully",
      data: newBill,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Error creating bill",
      error: error.message,
    });
  }
};

export const getBillsByStsId = async (req: Request, res: Response) => {
  const stsId = req.params.stsId;

  if (!stsId) {
    return res.status(400).json({
      success: false,
      message: "STS ID is required",
    });
  }

  try {
    const bills = await ContractorBill.find({ stsId: stsId });
    if (bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bills found for the provided STS ID",
      });
    }

    res.status(200).json({
      success: true,
      data: bills,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bills",
      error: error.message,
    });
  }
};
