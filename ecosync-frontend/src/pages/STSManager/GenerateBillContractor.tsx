import axios from "axios";
import { useEffect, useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const GenerateBillContractor: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [stsId, setStsId] = useState<string>("");
  const [contractorName, setContractorName] = useState<string>("");
  const [weightCollected, setWeightCollected] = useState<number>(0);
  const [requiredWeight, setRequiredWeight] = useState<number>(0);
  const [paymentPerTon, setPaymentPerTon] = useState<number>(0);
  const [fineRate, setFineRate] = useState<number>(0);
  const [billingSlips, setBillingSlips] = useState<any[]>([]);
  const [stss, setStss] = useState<any[]>([]);

  useEffect(() => {
    getAllSTS();
    fetchBillingSlips();
  }, []);

  const getAllSTS = async () => {
    try {
      const response = await axios.get(`${server}/sts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setStss(response.data);
      if (response.data.length > 0) {
        setStsId(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching STS data:", error);
      toast.error("Failed to fetch STS data.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${server}/sts/contractor/bill`, {
        stsId,
        contractorName,
        weightCollected,
        requiredWeight,
        paymentPerTon,
        fineRate,
      });
      if (response.status === 201) {
        toast.success("Bill created successfully");
        fetchBillingSlips();
      }
    } catch (error) {
      console.error("Error generating billing slip:", error);
      toast.error("Failed to create bill");
    }
  };

  const fetchBillingSlips = async () => {
    try {
      const response = await axios.get(`${server}/sts/bills/${stsId}`);
      setBillingSlips(response?.data?.data);
    } catch (error) {
      console.error("Error fetching billing slips:", error);
      toast.error("Failed to fetch billing slips");
    }
  };

  const downloadBillAsPDF = async (billingSlip: any) => {
    const pdf = new jsPDF();
    pdf.setFont("helvetica");
    pdf.setFontSize(12);
    let y = 20;
    pdf.text("Billing Slip", 105, y, { align: "center" });
    y += 10;
    pdf.text(`STS ID: ${billingSlip.stsId}`, 10, y);
    y += 10;
    pdf.text(`Contractor Name: ${billingSlip.contractorName}`, 10, y);
    y += 10;
    pdf.text(`Weight Collected: ${billingSlip.weightCollected} tonnes`, 10, y);
    y += 10;
    pdf.text(`Required Weight: ${billingSlip.requiredWeight} tonnes`, 10, y);
    y += 10;
    pdf.text(`Payment Per Ton: $${billingSlip.paymentPerTon}`, 10, y);
    y += 10;
    pdf.text(`Fine Rate: $${billingSlip.fineRate} per missing ton`, 10, y);
    y += 20;
    pdf.setLineWidth(0.5);
    pdf.line(10, y, 200, y);
    y += 10;
    pdf.text("Thank you for your business!", 105, y, { align: "center" });
    pdf.save(`billing_slip_${billingSlip._id}.pdf`);
  };

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
            value={stsId}
            onChange={(e) => setStsId(e.target.value)}
            className="select select-bordered w-full"
            required
          >
            {stss.map((sts) => (
              <option key={sts._id} value={sts._id}>
                {sts.wardNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="contractorName" className="block font-medium mb-1">
            Contractor Name
          </label>
          <input
            type="text"
            id="contractorName"
            value={contractorName}
            onChange={(e) => setContractorName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="weightCollected" className="block font-medium mb-1">
            Weight Collected (tonnes)
          </label>
          <input
            type="number"
            id="weightCollected"
            value={weightCollected}
            onChange={(e) => setWeightCollected(parseFloat(e.target.value))}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="requiredWeight" className="block font-medium mb-1">
            Required Weight (tonnes)
          </label>
          <input
            type="number"
            id="requiredWeight"
            value={requiredWeight}
            onChange={(e) => setRequiredWeight(parseFloat(e.target.value))}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="paymentPerTon" className="block font-medium mb-1">
            Payment Per Ton ($)
          </label>
          <input
            type="number"
            id="paymentPerTon"
            value={paymentPerTon}
            onChange={(e) => setPaymentPerTon(parseFloat(e.target.value))}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fineRate" className="block font-medium mb-1">
            Fine Rate ($ per missing ton)
          </label>
          <input
            type="number"
            id="fineRate"
            value={fineRate}
            onChange={(e) => setFineRate(parseFloat(e.target.value))}
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
      {billingSlips.length > 0 && (
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
                    Contractor Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Weight Collected
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Required Weight
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Payment Per Ton
                  </th>
                  <th className="border border-gray-200 px-4 py-2">
                    Fine Rate
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {billingSlips.map((slip, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.stsId}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.contractorName}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.weightCollected}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.requiredWeight}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.paymentPerTon}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {slip.fineRate}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <button
                        className="btn bg-blue-500 text-white hover:bg-blue-600"
                        onClick={() => downloadBillAsPDF(slip)}
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
      )}
    </div>
  );
};

export default GenerateBillContractor;
