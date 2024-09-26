import { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBinFill } from "react-icons/ri";
import { FaUserPlus } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../../components/Table";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import AddTransportedWasteEntryModal from "../../components/AddTransportedWasteEntryModal";

export type TransportedWasteEntry = {
  _id: string;
  timeAndDateOfCollection: Date;
  amountCollectedKg: number;
  contractorId: string;
  typeOfWaste: string;
  designatedSTS: string;
  vehicleUsed: string;
};

const Entries = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<TransportedWasteEntry[]>([]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${server}/waste-entries`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setEntries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transported waste entries:", error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const response = await axios.delete(
        `${server}/waste-entries/${entryId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Transported waste entry deleted successfully");
        fetchEntries();
      } else {
        toast.error("Failed to delete transported waste entry");
      }
    } catch (error) {
      console.error("Error deleting transported waste entry:", error);
    }
  };

  const columnHelper = createColumnHelper<TransportedWasteEntry>();
  const columns = [
    columnHelper.accessor("timeAndDateOfCollection", {
      header: () => "Time of Collection",
      cell: (info) =>
        new Date(info.row.original.timeAndDateOfCollection).toLocaleString(),
    }),
    columnHelper.accessor("amountCollectedKg", {
      header: () => "Amount Collected (kg)",
      cell: (info) => info.row.original.amountCollectedKg,
    }),
    columnHelper.accessor("contractorId", {
      header: () => "Contractor ID",
      cell: (info) => info.row.original.contractorId,
    }),
    columnHelper.accessor("typeOfWaste", {
      header: () => "Waste Type",
      cell: (info) => info.row.original.typeOfWaste,
    }),
    columnHelper.accessor("designatedSTS", {
      header: () => "Designated STS",
      cell: (info) => info.row.original.designatedSTS,
    }),
    columnHelper.accessor("vehicleUsed", {
      header: () => "Vehicle Used",
      cell: (info) => info.row.original.vehicleUsed,
    }),
    columnHelper.accessor("_id", {
      header: () => "Delete Entry",
      cell: (info) => (
        <>
          <button
            onClick={() => handleDeleteEntry(info.row.original._id)}
            className="btn btn-error text-white"
          >
            <RiDeleteBinFill />
          </button>
        </>
      ),
    }),
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <nav className="bg-light flex justify-end px-20 gap-3 h-[80px]">
        <div className="flex items-center justify-center ">
          <button
            onClick={() => {
              const modal = document.getElementById(
                "add-transported-waste-entry-modal"
              );
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Add Entry
          </button>
          <AddTransportedWasteEntryModal refreshData={fetchEntries} />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={entries} />
      </div>
    </div>
  );
};

export default Entries;
