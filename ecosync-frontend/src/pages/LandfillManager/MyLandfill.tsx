import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";

type Landfill = {
  id: string;
  landfillId: string;
  name: string;
  capacity: number;
  operationalTimespan: string;
  location: string;
  managers: string[];
};

type TruckDumpingEntry = {
  _id: string;
  landfillId: string;
  timeOfArrival: Date;
  weightOfWaste: number;
};

type Statistics = {
  totalWeight: number;
  avgWeightPerEntry: number;
  totalEntries: number;
};

type Overview = {
  landfill: Landfill;
  recentTruckDumpingEntries: TruckDumpingEntry[];
  statistics: Statistics;
};

type Manager = {
  _id: string;
  name: string;
  email: string;
};

const MyLandfill: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const managerId = user?._id;
  const [overview, setOverview] = useState<Overview | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);

  const getLandfill = async () => {
    try {
      const response = await axios.get<Overview>(
        `${server}/landfill/details/${managerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      fetchLandfillOverview(response?.data);
      getLandfillManagers(response?.data);
    } catch (error) {
      console.error("Error fetching Landfill overview:", error);
    }
  };

  const getLandfillManagers = async (landfill: any) => {
    const landfillId = landfill._id;
    try {
      const response = await axios.get<Manager[]>(
        `${server}/landfill/managers/${landfillId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.data) {
        const data: any = response.data;
        setManagers(data?.managers);
      }
    } catch (error) {
      console.error("Error fetching Landfill managers:", error);
    }
  };

  const fetchLandfillOverview = async (landfill: any) => {
    const landfillId = landfill._id;
    try {
      const response = await axios.get<Overview>(
        `${server}/landfill/overview/${landfillId}`
      );
      console.log(response.data);
      setOverview(response.data);
    } catch (error: any) {
      console.error("Error fetching Landfill overview:", error);
    }
  };

  useEffect(() => {
    getLandfill();
  }, [managerId]);

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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Landfill Information</h2>
          <div className="space-y-4">
            <p>
              <span className="font-semibold">Landfill ID:</span>{" "}
              {overview.landfill.landfillId}
            </p>
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {overview.landfill.name}
            </p>
            <p>
              <span className="font-semibold">Capacity:</span>{" "}
              {overview.landfill.capacity} tonnes
            </p>
            <p>
              <span className="font-semibold">Operational Timespan:</span>{" "}
              {overview.landfill.operationalTimespan}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Recent Truck Dumping Entries
          </h2>
          <ul>
            {overview.recentTruckDumpingEntries.map((entry: any) => (
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

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-4">
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Managers</h2>
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
  );
};

export default MyLandfill;
