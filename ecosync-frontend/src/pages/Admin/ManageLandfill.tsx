import { FaUserPlus } from "react-icons/fa";
import Table from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { RootState, server } from "../../redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GrDocumentUpdate } from "react-icons/gr";
import CreateLandfill from "../../components/CreateLandfill";
import UpdateLandfill from "../../components/UpdateLandfill";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type Landfill = {
  _id: string;
  name: string;
  capacity: number;
  operationalTimespan: string;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  landfillId: string;
};

const ManageLandfill = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [landfills, setLandfills] = useState<Landfill[]>([]);
  const [landfill, setLandfill] = useState<Landfill>();
  const [updateLandfillId, setUpdateLandfillId] = useState<string | null>(null);
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

  useEffect(() => {
    getAllLandfill();
  }, []);

  const handleDeleteLandfill = async (landfillId: string) => {
    try {
      const response = await axios.delete(`${server}/landfills/${landfillId}`, {
        headers: {
          Authorization: user?.token || "",
        },
      });
      if (response.status === 204) {
        toast.error("Landfill deleted successfully");
        getAllLandfill();
      } else {
        toast.error("Failed to delete STS");
      }
    } catch (error) {
      console.error("Error deleting STS:", error);
    }
  };

  const columnHelper = createColumnHelper<Landfill>();
  const columns = [
    columnHelper.accessor("landfillId", {
      header: () => "Landfill Id",
      cell: (info) => info.row.original.landfillId,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.row.original.name,
    }),
    columnHelper.accessor("capacity", {
      header: () => "Capacity",
      cell: (info) => info.row.original.capacity,
    }),
    columnHelper.accessor("operationalTimespan", {
      header: () => "Operational Timespan",
      cell: (info) => info.row.original.operationalTimespan,
    }),
    columnHelper.accessor("_id", {
      header: () => "Details",
      cell: (info) => (
        <>
          <Link
            className="btn btn-success btn-outline"
            to={`${info.row.original._id}`}
          >
            Details
          </Link>
        </>
      ),
    }),
    columnHelper.accessor("_id", {
      header: () => "Update",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setUpdateLandfillId(info.row.original._id);
              setLandfill(info.row.original);
              const modal = document.getElementById("update-landfill-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg"
          >
            <GrDocumentUpdate />
          </button>
        </>
      ),
    }),
    columnHelper.accessor("_id", {
      header: () => "Delete",
      cell: (info) => (
        <>
          <button
            onClick={() => handleDeleteLandfill(info.row.original._id)}
            className="btn btn-error"
          >
            Delete
          </button>
        </>
      ),
    }),
  ];

  return (
    <div>
      <nav className="bg-light flex justify-end px-20 gap-3 h-[80px]">
        <div className="flex items-center justify-center ">
          <button
            onClick={() => {
              const modal = document.getElementById("new-landfill-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Create Landfill
          </button>
          <CreateLandfill getAllLandfill={getAllLandfill} />
          <UpdateLandfill
            landfill={landfill}
            landfillId={updateLandfillId}
            getAllLandfill={getAllLandfill}
          />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={landfills} />
      </div>
    </div>
  );
};

export default ManageLandfill;
