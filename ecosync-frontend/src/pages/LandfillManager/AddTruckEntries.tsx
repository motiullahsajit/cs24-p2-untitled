import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddTruckEntries: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const managerId = user?._id;
  const [landfillId, setLandfillId] = useState<string>("");
  const [weightOfWaste, setWeightOfWaste] = useState<number>(0);
  const [timeOfArrival, setTimeOfArrival] = useState<string>("");
  const [timeOfDeparture, setTimeOfDeparture] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);

  const getLandfill = async () => {
    try {
      const response = await axios.get(
        `${server}/landfill/details/${managerId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      setLandfillId(response?.data?._id);
    } catch (error) {
      console.error("Error fetching Landfill overview:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${server}/landfills/add-truck-dumping-entry`,
        {
          landfillId,
          weightOfWaste,
          timeOfArrival,
          timeOfDeparture,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );

      setWeightOfWaste(0);
      setTimeOfArrival("");
      setTimeOfDeparture("");

      if (response) {
        toast.success("Truck dumped entry added successfully");
        getEntries();
      }
    } catch (error) {
      console.error("Error adding truck dumping entry:", error);
    }
  };

  const getEntries = async () => {
    try {
      const response = await axios.get(
        `${server}/landfill/entries/${landfillId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  useEffect(() => {
    getLandfill();
  }, []);

  useEffect(() => {
    if (landfillId) {
      getEntries();
    }
  }, [landfillId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Add Truck Dumping Entry
      </h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="landfillId" className="block font-medium mb-1">
            Landfill ID
          </label>
          <input
            type="text"
            id="landfillId"
            defaultValue={landfillId}
            disabled
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="weightOfWaste" className="block font-medium mb-1">
            Weight of Waste (tonnes)
          </label>
          <input
            type="number"
            id="weightOfWaste"
            value={weightOfWaste}
            onChange={(e) => setWeightOfWaste(parseFloat(e.target.value))}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeOfArrival" className="block font-medium mb-1">
            Time of Arrival
          </label>
          <input
            type="datetime-local"
            id="timeOfArrival"
            value={timeOfArrival}
            onChange={(e) => setTimeOfArrival(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeOfDeparture" className="block font-medium mb-1">
            Time of Departure
          </label>
          <input
            type="datetime-local"
            id="timeOfDeparture"
            value={timeOfDeparture}
            onChange={(e) => setTimeOfDeparture(e.target.value)}
            className="input w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Entry
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Truck Dumping Entries
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">
                  Weight of Waste (tonnes)
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Time of Arrival
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Time of Departure
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.weightOfWaste}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.timeOfArrival}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {entry.timeOfDeparture}
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

export default AddTruckEntries;
