import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddEntries: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const managerId = user?._id;
  const [stsId, setStsId] = useState<string>("");
  const [vehicleNumber, setVehicleNumber] = useState<string>("");
  const [weightOfWaste, setWeightOfWaste] = useState<number>(0);
  const [timeOfArrival, setTimeOfArrival] = useState<string>("");
  const [timeOfDeparture, setTimeOfDeparture] = useState<string>("");
  const [entries, setEntries] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const getSTS = async () => {
    try {
      const response = await axios.get(`${server}/sts/details/${managerId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setStsId(response?.data?.sts?._id);
    } catch (error) {
      console.error("Error fetching STS overview:", error);
    }
  };

  const getEntries = async () => {
    try {
      const response = await axios.get(`${server}/sts/entries/${stsId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const getAllVehicles = async () => {
    try {
      const response = await axios.get(`${server}/sts/vehicles/${stsId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response) {
        setVehicles(response.data.vehicles);
        setVehicleNumber(response.data.vehicles[0].registrationNumber);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      stsId,
      vehicleNumber,
      weightOfWaste,
      timeOfArrival,
      timeOfDeparture
    );
    try {
      const response = await axios.post(
        `${server}/sts/add-vehicle-entry`,
        {
          stsId,
          vehicleNumber,
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

      if (response) {
        toast.success("Entry added successfully");
      }

      setStsId("");
      setVehicleNumber("");
      setWeightOfWaste(0);
      setTimeOfArrival("");
      setTimeOfDeparture("");
      getEntries();
    } catch (error) {
      console.error("Error adding vehicle entry:", error);
    }
  };

  useEffect(() => {
    getSTS();
    getAllVehicles();
    if (stsId) {
      getEntries();
    }
  }, [stsId, managerId]);

  return (
    <div className="bg-gray-100 p-6 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Add Vehicle Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="stsId" className="block font-medium mb-1">
            STS ID
          </label>
          <input
            type="text"
            id="stsId"
            defaultValue={stsId}
            className="input w-[250px]"
            required
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vehicleNumber" className="block font-medium mb-1">
            Vehicle Number
          </label>
          <select
            id="vehicleNumber"
            className="select w-[250px]"
            value={vehicleNumber}
            onBlur={(e) => setVehicleNumber(e.target.value)}
          >
            {vehicles?.map((truck: any) => (
              <option key={truck._id} value={truck?.registrationNumber}>
                {truck.registrationNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="weightOfWaste" className="block font-medium mb-1">
            Weight of Waste (in tonnes)
          </label>
          <input
            type="number"
            id="weightOfWaste"
            value={weightOfWaste}
            onChange={(e) => setWeightOfWaste(parseFloat(e.target.value))}
            className="input w-[250px]"
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
            className="input"
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
            className="input"
            required
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 text-white hover:bg-blue-600"
        >
          Add Entry
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Entries</h2>
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Vehicle Number</th>
                <th className="px-4 py-2">Weight of Waste (tonnes)</th>
                <th className="px-4 py-2">Time of Arrival</th>
                <th className="px-4 py-2">Time of Departure</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any) => (
                <tr
                  key={entry._id}
                  className="border-b border-gray-200 text-center"
                >
                  <td className="px-4 py-2">{entry.vehicleNumber}</td>
                  <td className="px-4 py-2">{entry.weightOfWaste}</td>
                  <td className="px-4 py-2">{entry.timeOfArrival}</td>
                  <td className="px-4 py-2">{entry.timeOfDeparture}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddEntries;
