import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";

const CheckFleet: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [stsId, setStsId] = useState<string>("");
  const [landfillId, setLandfillId] = useState<string>("");
  const [optimalTrucks, setOptimalTrucks] = useState<any[]>([]);
  const managerId = user?._id;
  const [landfills, setLandfills] = useState<any[]>([]);
  const getAllLandfill = async () => {
    try {
      const response = await axios.get(`${server}/landfills`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setLandfills(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };
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

  useEffect(() => {
    getSTS();
    getAllLandfill();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${server}/sts/optimize-fleet`,
        {
          stsId,
          landfillId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      setOptimalTrucks(response.data.optimalTrucks);
    } catch (error) {
      console.error("Error optimizing fleet:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4">Optimize Fleet</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="stsId" className="block font-medium mb-1">
            STS ID
          </label>
          <input
            type="text"
            id="stsId"
            defaultValue={stsId}
            className="input input-bordered w-[250px]"
            required
            disabled
          />
        </div>

        <div className="mb-4">
          <label htmlFor="landfillId" className="block font-medium mb-1">
            Landfill ID
          </label>
          <select
            id="landfillId"
            className="select w-[250px] select-bordered"
            onBlur={(e) => setLandfillId(e.target.value)}
          >
            {landfills?.map((landfill: any) => (
              <option key={landfill._id} value={landfill?._id}>
                {landfill.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 text-white hover:bg-blue-600"
        >
          Optimize Fleet
        </button>
      </form>
      {optimalTrucks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Optimal Trucks</h2>
          <ul>
            {optimalTrucks.map((truck: any) => (
              <li key={truck._id}>
                <p>Truck ID: {truck._id}</p>
                <p>Capacity: {truck.capacity}</p>
                {/* Add more truck details as needed */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CheckFleet;
