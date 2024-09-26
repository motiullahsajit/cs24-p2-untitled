import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const GenerateBill: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const managerId = user?._id;
  const [stsId, setStsId] = useState<string>("");
  const [landfillId, setLandfillId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [timeOfTransport, setTimeOfTransport] = useState<string>("");
  const [weightOfWaste, setWeightOfWaste] = useState<number>(0);
  const [billingSlips, setBillingSlips] = useState<any[]>([]);
  const [stss, setStss] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const getAllSTS = async () => {
    try {
      const response = await axios.get(`${server}/sts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setStss(response.data);
      setStsId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  const getAllVehicles = async () => {
    try {
      const response = await axios.get(`${server}/vehicle`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setVehicles(response.data);
      setVehicleId(response.data[0]._id);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

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
        `${server}/landfills/generate-billing-slip`,
        {
          stsId,
          landfillId,
          vehicleId,
          timeOfTransport,
          weightOfWaste,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response) {
        toast.success("Bill created successfully");
        getBillingSlips();
      }
      setStsId("");
      setVehicleId("");
      setTimeOfTransport("");
      setWeightOfWaste(0);
    } catch (error) {
      console.error("Error generating billing slip:", error);
    }
  };

  const getBillingSlips = async () => {
    try {
      const response = await axios.get(
        `${server}/landfill/all-billing-slip/${landfillId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      setBillingSlips(response.data);
    } catch (error) {
      console.error("Error fetching billing slips:", error);
    }
  };

  const downloadBillAsPDF = async (billingSlip: any) => {
    try {
      const pdf = new jsPDF();

      pdf.setFont("helvetica");
      pdf.setFontSize(12);

      let y = 20;

      pdf.text("Billing Slip", 105, y, { align: "center" });
      y += 10;

      pdf.text(`STS ID: ${billingSlip.stsId}`, 10, y);
      y += 10;
      pdf.text(`Landfill ID: ${billingSlip.landfillId}`, 10, y);
      y += 10;
      pdf.text(`Vehicle ID: ${billingSlip.vehicleId}`, 10, y);
      y += 10;
      pdf.text(`Time of Transport: ${billingSlip.timeOfTransport}`, 10, y);
      y += 10;
      pdf.text(`Fuel Allocation: ${billingSlip.fuelAllocation}`, 10, y);
      y += 10;
      pdf.text(`Weight of Waste (tonnes): ${billingSlip.weightOfWaste}`, 10, y);
      y += 20;

      pdf.setLineWidth(0.5);
      pdf.line(10, y, 200, y);
      y += 10;

      pdf.text("Thank you for your business!", 105, y, { align: "center" });

      pdf.save(`billing_slip_${billingSlip._id}.pdf`);
    } catch (error) {
      console.error("Error downloading bill as PDF:", error);
    }
  };

  useEffect(() => {
    getLandfill();
    getAllSTS();
    getAllVehicles();
  }, [managerId]);

  useEffect(() => {
    if (landfillId) {
      getBillingSlips();
    }
  }, [landfillId]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-4 text-center">
        Generate Billing Slip
      </h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="stsId" className="block font-medium mb-1">
            STS ID
          </label>
          <select
            id="stsId"
            className="select w-full select-bordered"
            onBlur={(e) => setStsId(e.target.value)}
          >
            {stss?.map((sts: any) => (
              <option key={sts._id} value={sts?._id}>
                {sts.wardNumber}
              </option>
            ))}
          </select>
        </div>
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
          <label htmlFor="vehicleId" className="block font-medium mb-1">
            Vehicle ID
          </label>
          <select
            id="vehicleId"
            className="select w-full select-bordered"
            onBlur={(e) => setVehicleId(e.target.value)}
          >
            {vehicles?.map((truck: any) => (
              <option key={truck._id} value={truck?._id}>
                {truck.registrationNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="timeOfTransport" className="block font-medium mb-1">
            Time of Transport
          </label>
          <input
            type="datetime-local"
            id="timeOfTransport"
            value={timeOfTransport}
            onChange={(e) => setTimeOfTransport(e.target.value)}
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
            className="input input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          Generate Slip
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Billing Slips
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2">STS ID</th>
                <th className="border border-gray-200 px-4 py-2">
                  Landfill ID
                </th>
                <th className="border border-gray-200 px-4 py-2">Vehicle ID</th>
                <th className="border border-gray-200 px-4 py-2">
                  Time of Transport
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Weight of Waste (tonnes)
                </th>
                <th className="border border-gray-200 px-4 py-2">
                  Fuel Allocation
                </th>
                <th className="border border-gray-200 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {billingSlips.map((billingSlip) => (
                <tr key={billingSlip._id} id="billingSlipContent">
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.stsId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.landfillId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.vehicleId}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.timeOfTransport}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.weightOfWaste}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {billingSlip.fuelAllocation}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <button
                      className="btn bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => downloadBillAsPDF(billingSlip)}
                    >
                      Download PDF
                    </button>
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

export default GenerateBill;
