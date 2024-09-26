import { Request, Response } from "express";
import Landfill from "../models/landfill.js";
import User from "../models/user.js";
import TruckDumpingEntry from "../models/truck-dumping-entry.js";
import BillingSlip from "../models/billing-slip.js";
import Vehicle from "../models/vehicle.js";

export const createLandfill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      capacity,
      operationalTimespan,
      location,
      managers,
      landfillId,
    } = req.body;

    const newLandfill = new Landfill({
      name,
      capacity,
      operationalTimespan,
      location,
      managers,
      landfillId,
    });

    await newLandfill.save();

    res.status(201).json({
      message: "Landfill created successfully",
      landfill: newLandfill,
    });
  } catch (error) {
    console.error("Error creating landfill:", error);
    res.status(500).json({ message: "Failed to create landfill" });
  }
};

export const getAllLandfills = async (req: Request, res: Response) => {
  try {
    const allLandfills = await Landfill.find();
    res.status(200).json(allLandfills);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getLandfillById = async (req: Request, res: Response) => {
  const { landfillId } = req.params;

  try {
    const landfill = await Landfill.findById(landfillId);
    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    res.status(200).json(landfill);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLandfill = async (req: Request, res: Response) => {
  const { landfillId } = req.params;
  const updateData = req.body;

  try {
    const landfill = await Landfill.findByIdAndUpdate(landfillId, updateData, {
      new: true,
    });
    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    res.status(200).json(landfill);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLandfill = async (req: Request, res: Response) => {
  const { landfillId } = req.params;

  try {
    const landfill = await Landfill.findByIdAndDelete(landfillId);
    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const assignLandfillManagers = async (req: Request, res: Response) => {
  const { landfillId } = req.params;
  const { managerId } = req.body;

  try {
    const landfill = await Landfill.findById(landfillId);
    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    const validManager = await User.findById(managerId);
    if (!validManager) {
      return res.status(400).json({ message: "Invalid manager ID" });
    }

    if (landfill.managers.includes(managerId)) {
      return res
        .status(400)
        .json({ message: "Manager already assigned to landfill" });
    }

    landfill.managers.push(managerId);
    await landfill.save();

    res.status(200).json(landfill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLandfillByManagerId = async (req: Request, res: Response) => {
  const { managerId } = req.params;
  try {
    const landfill = await Landfill.findOne({ managers: managerId }).populate(
      "managers"
    );

    if (!landfill) {
      return res
        .status(404)
        .json({ message: "Landfill not found for the provided manager ID" });
    }

    res.status(200).json(landfill);
  } catch (error) {
    console.error("Error while retrieving landfill by manager ID:", error);
    res
      .status(500)
      .json({ message: "Failed to get landfill details by manager ID" });
  }
};

export const getUnassignedLandfillManagers = async (
  req: Request,
  res: Response
) => {
  try {
    const landfillManagers = await User.find({ role: "landfill_manager" });

    const allLandfills = await Landfill.find();

    const assignedManagerIds = allLandfills.flatMap(
      (landfill) => landfill.managers
    );

    const unassignedManagers = landfillManagers.filter(
      (manager) => !assignedManagerIds.includes(manager._id)
    );

    res.status(200).json({ landfillManagers: unassignedManagers });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getLandfillManagers = async (req: Request, res: Response) => {
  const { landfillId } = req.params;

  try {
    const landfill = await Landfill.findById(landfillId);

    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    const managers = await User.find({ _id: { $in: landfill.managers } });

    res.status(200).json({ managers });
  } catch (error) {
    console.error("Error retrieving landfill managers:", error);
    res.status(500).json({ message: "Failed to retrieve landfill managers" });
  }
};

export const addTruckDumpingEntry = async (req: Request, res: Response) => {
  const { landfillId, weightOfWaste, timeOfArrival, timeOfDeparture } =
    req.body;

  try {
    const newEntry = new TruckDumpingEntry({
      landfillId,
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

export const getAllEntriesByLandfillId = async (
  req: Request,
  res: Response
) => {
  const landfillId = req.params.landfillId;

  try {
    const entries = await TruckDumpingEntry.find({ landfillId });

    if (entries.length === 0) {
      return res
        .status(404)
        .json({ message: "No entries found for this landfillId" });
    }

    return res.status(200).json(entries);
  } catch (error) {
    console.error("Error retrieving entries:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBillingSlipsByLandfillId = async (
  req: Request,
  res: Response
) => {
  const { landfillId } = req.params;

  try {
    const billingSlips = await BillingSlip.find({ landfillId });
    res.status(200).json(billingSlips);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const generateBillingSlip = async (req: Request, res: Response) => {
  try {
    const { stsId, landfillId, vehicleId, timeOfTransport, weightOfWaste } =
      req.body;

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    const { fullyLoaded, unloaded } = vehicle.fuelCostPerKilometer;

    const capacity = vehicle.capacity;
    const loadedWeight = Math.min(weightOfWaste, capacity);
    const fuelAllocation =
      unloaded + (loadedWeight / 5) * (fullyLoaded - unloaded);

    const newBillingSlip = new BillingSlip({
      stsId,
      landfillId,
      vehicleId,
      timeOfTransport,
      weightOfWaste,
      fuelAllocation,
    });

    const savedBillingSlip = await newBillingSlip.save();

    res.status(201).json(savedBillingSlip);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to generate billing slip",
      error: error.message,
    });
  }
};

export const getLandfillOverview = async (req: Request, res: Response) => {
  const { landfillId } = req.params;

  try {
    const landfill = await Landfill.findById(landfillId).populate("managers");

    if (!landfill) {
      return res.status(404).json({ message: "Landfill not found" });
    }

    const recentTruckDumpingEntries = await TruckDumpingEntry.find({
      landfillId,
    })
      .sort({ timeOfArrival: -1 })
      .limit(5);

    const totalWeight = await TruckDumpingEntry.aggregate([
      { $match: { landfillId: landfillId } },
      { $group: { _id: null, totalWeight: { $sum: "$weightOfWaste" } } },
    ]);

    const avgWeightPerEntry = await TruckDumpingEntry.aggregate([
      { $match: { landfillId: landfillId } },
      {
        $group: {
          _id: null,
          avgWeightPerEntry: { $avg: "$weightOfWaste" },
        },
      },
    ]);

    const totalEntries = await TruckDumpingEntry.countDocuments({
      landfillId: landfillId,
    });

    const overview = {
      landfill: {
        id: landfill._id,
        landfillId: landfill.landfillId,
        name: landfill.name,
        capacity: landfill.capacity,
        operationalTimespan: landfill.operationalTimespan,
        location: landfill.location,
        managers: landfill.managers,
      },
      recentTruckDumpingEntries,
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
