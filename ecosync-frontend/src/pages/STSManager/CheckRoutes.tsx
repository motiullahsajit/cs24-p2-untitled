import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import axios from "axios";

const CheckRoutes: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [stsId, setStsId] = useState<string>("");
  const [landfillId, setLandfillId] = useState<string>("");
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
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
        `${server}/sts/optimize-route`,
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
      setOptimizedRoute(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error optimizing route:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 flex justify-around">
      <div>
        <h1 className="text-3xl font-semibold mb-4">Optimize Route</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="stsId" className="block font-medium mb-1">
              STS ID
            </label>
            <input
              type="text"
              id="stsId"
              defaultValue={stsId}
              className="input w-[250px] input-bordered"
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
              className="select w-[250px]"
              value={landfillId}
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
            Optimize Route
          </button>
        </form>
        {optimizedRoute && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Optimized Route Details
            </h2>
            <p>Distance: {optimizedRoute?.legs[0]?.distance?.text}</p>
            <p>Duration: {optimizedRoute?.legs[0]?.duration?.text}</p>
            <p>Steps: {optimizedRoute?.legs[0]?.steps?.length}</p>
            {/* Add more details as needed */}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4"> Map</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d27427.642820832603!2d90.3695602494293!3d23.767130722034878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1715313660446!5m2!1sen!2sbd"
          width="800"
          height="600"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default CheckRoutes;
