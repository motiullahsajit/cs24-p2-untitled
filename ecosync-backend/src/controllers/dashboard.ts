import { Request, Response } from "express";
import STS from "../models/sts.js";
import Landfill from "../models/landfill.js";
import VehicleEntry from "../models/vehicle-entry.js";
import TruckDumpingEntry from "../models/truck-dumping-entry.js";

export const getDashboardStatistics = async (req: Request, res: Response) => {
  try {
    const stsData = await STS.find();
    const landfillData = await Landfill.find();

    const vehicleEntries = await VehicleEntry.find();

    const truckDumpingEntries = await TruckDumpingEntry.find();

    const stsStatistics = calculateSTSTatistics(stsData, vehicleEntries);
    const landfillStatistics = calculateLandfillStatistics(
      landfillData,
      truckDumpingEntries
    );
    const dailyFuelCostStatistics =
      calculateDailyFuelCostStatistics(truckDumpingEntries);

    res.status(200).json({
      stsStatistics,
      landfillStatistics,
      dailyFuelCostStatistics,
    });
  } catch (error: any) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

const calculateSTSTatistics = (stsData: any[], vehicleEntries: any[]) => {
  const stsStatistics = stsData.map((sts) => {
    const totalWasteCollected = vehicleEntries.reduce((total, entry) => {
      if (entry.stsId === sts.stsId) {
        total += entry.weightOfWaste;
      }
      return total;
    }, 0);
    return { stsId: sts.stsId, totalWasteCollected };
  });
  return stsStatistics;
};

const calculateLandfillStatistics = (
  landfillData: any[],
  truckDumpingEntries: any[]
) => {
  const landfillStatistics = landfillData.map((landfill) => {
    const totalWasteDumped = truckDumpingEntries.reduce((total, entry) => {
      if (entry.landfillId === landfill._id) {
        total += entry.weightOfWaste;
      }
      return total;
    }, 0);
    return { landfillId: landfill._id, totalWasteDumped };
  });
  return landfillStatistics;
};

const calculateDailyFuelCostStatistics = (truckDumpingEntries: any[]) => {
  const dailyFuelCostStatistics = truckDumpingEntries.reduce(
    (dailyCosts, entry) => {
      const date = entry.timeOfDeparture.toDateString();
      dailyCosts[date] = (dailyCosts[date] || 0) + calculateFuelCost(entry);
      return dailyCosts;
    },
    {}
  );
  return dailyFuelCostStatistics;
};

const calculateFuelCost = (entry: any) => {
  const weight = entry.weightOfWaste;
  const distance = calculateDistance(entry);
  const fuelCostPerKm = 0.1;
  return weight * distance * fuelCostPerKm;
};

const calculateDistance = (entry: any) => {
  return 50;
};
