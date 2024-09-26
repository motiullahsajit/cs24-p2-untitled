import { server } from "../../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddManagerSTS from "../../components/AddManagerSTS";
import { FaUserPlus } from "react-icons/fa";
import AddVehicleSTS from "../../components/AddVehicleSTS";

const STSDetails = () => {
  const param = useParams();
  const stsId = param.id;

  const [overview, setOverview] = useState<any | null>(null);
  const [managers, setManagers] = useState<any>([]);
  const [vehicles, setVehicles] = useState<any>([]);

  const getSTSMangers = async () => {
    try {
      const response = await axios.get<any>(`${server}/sts/managers/${stsId}`);
      if (response.data) {
        const data: any = response.data;
        setManagers(data.managers);
      }
    } catch (error) {
      console.error("Error fetching STS overview:", error);
    }
  };

  const getSTSVehicles = async () => {
    try {
      const response = await axios.get<any>(`${server}/sts/vehicles/${stsId}`);
      if (response.data) {
        const data: any = response.data;
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching STS overview:", error);
    }
  };

  const fetchSTSOverview = async () => {
    try {
      const response = await axios.get<any>(`${server}/sts/overview/${stsId}`);
      setOverview(response.data);
    } catch (error) {
      console.error("Error fetching STS overview:", error);
    }
  };

  useEffect(() => {
    fetchSTSOverview();
    getSTSMangers();
    getSTSVehicles();
  }, [stsId]);

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">STS Information</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">STS ID:</span>{" "}
              {overview.sts.stsId}
            </p>
            <p>
              <span className="font-semibold">Ward Number:</span>{" "}
              {overview.sts.wardNumber}
            </p>
            <p>
              <span className="font-semibold">Capacity:</span>{" "}
              {overview.sts.capacity} tonnes
            </p>
            <p>
              <span className="font-semibold">Number of Trucks:</span>{" "}
              {overview.sts.numTrucks}
            </p>
          </div>
        </div>

        <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Vehicle Entries</h2>
          <ul>
            {overview.recentVehicleEntries.map((entry: any) => (
              <li key={entry._id} className="mb-4">
                <p>
                  <span className="font-semibold">Time of Arrival:</span>{" "}
                  {entry.timeOfArrival}
                </p>
                <p>
                  <span className="font-semibold">Weight of Waste:</span>{" "}
                  {entry.weightOfWaste} tonnes
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Total Weight:</span>{" "}
              {overview.statistics.totalWeight} tonnes
            </p>
            <p>
              <span className="font-semibold">Average Weight Per Entry:</span>{" "}
              {overview.statistics.avgWeightPerEntry} tonnes
            </p>
            <p>
              <span className="font-semibold">Total Entries:</span>{" "}
              {overview.statistics.totalEntries}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-100 px-6 py-4 flex justify-between">
            <h2 className="text-xl font-semibold">Managers List</h2>
            <AddManagerSTS getSTSMangers={getSTSMangers} stsId={stsId} />
            <button
              onClick={() => {
                const modal = document.getElementById("manager-sts-modal");
                if (modal) {
                  (modal as any).showModal();
                }
              }}
              className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
            >
              <FaUserPlus />
              Add New Manager
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">Username</th>
                  <th className="border border-gray-200 px-4 py-2">Name</th>
                  <th className="border border-gray-200 px-4 py-2">Email</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody>
                {managers &&
                  managers.map((manager: any) => (
                    <tr key={manager._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {manager?.username}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {manager.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {manager.email}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {manager?.phoneNumber}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg overflow-hidden shadow-md">
          <div className="bg-gray-100 px-6 py-4 flex justify-between">
            <h2 className="text-xl font-semibold">Vehicles List</h2>
            <AddVehicleSTS getSTSVehicles={getSTSVehicles} stsId={stsId} />
            <button
              onClick={() => {
                const modal = document.getElementById("t-sts-modal");
                if (modal) {
                  (modal as any).showModal();
                }
              }}
              className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
            >
              <FaUserPlus />
              Add New Vehicles
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2">
                    REG. Number
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Capacity</th>
                  <th className="border border-gray-200 px-4 py-2">Type</th>
                  <th className="border border-gray-200 px-4 py-2">
                    Fuel Cost Loaded
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Fuel Cost Unloaded
                  </th>
                </tr>
              </thead>
              <tbody>
                {vehicles &&
                  vehicles.map((entry: any) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2">
                        {entry.registrationNumber}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {entry.capacity} tonnes
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {entry.type}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {entry.fuelCostPerKilometer.fullyLoaded}
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        {entry.fuelCostPerKilometer.unloaded}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STSDetails;