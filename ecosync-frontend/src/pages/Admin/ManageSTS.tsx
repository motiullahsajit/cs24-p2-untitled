import { FaUserPlus } from "react-icons/fa";
import Table from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import axios from "axios";
import { RootState, server } from "../../redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateSTS from "../../components/CreateSTS";
import UpdateSTS from "../../components/UpdateSTS";
import { GrDocumentUpdate } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export type STS = {
  _id: string;
  wardNumber: string;
  capacity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  trucks: string[];
  stsId: string;
};

const ManageSTS = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [stss, setStss] = useState<STS[]>([]);
  const [sts, setSTS] = useState<STS>();
  const [updateSTSId, setUpdateSTSId] = useState<string | null>(null);
  const getAllSTS = async () => {
    try {
      const response = await axios.get(`${server}/sts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setStss(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    getAllSTS();
  }, []);

  const handleDeleteSTS = async (stsId: string) => {
    try {
      const response = await axios.delete(`${server}/sts/${stsId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 200) {
        toast.success("STS deleted successfully");
        getAllSTS();
      } else {
        toast.error("Failed to delete STS");
      }
    } catch (error) {
      console.error("Error deleting STS:", error);
    }
  };

  const columnHelper = createColumnHelper<STS>();
  const columns = [
    columnHelper.accessor("stsId", {
      header: () => "STS ID",
      cell: (info) => info.row.original.stsId,
    }),
    columnHelper.accessor("capacity", {
      header: () => "Capacity",
      cell: (info) => info.row.original.capacity,
    }),
    columnHelper.accessor("wardNumber", {
      header: () => "Ward Number",
      cell: (info) => info.row.original.wardNumber,
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
              setUpdateSTSId(info.row.original._id);
              setSTS(info.row.original);
              const modal = document.getElementById("update-sts-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="btn btn-success text-white"
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
            onClick={() => handleDeleteSTS(info.row.original._id)}
            className="btn btn-error text-white"
          >
            <RiDeleteBinFill />
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
              const modal = document.getElementById("new-sts-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Create STS
          </button>
          <UpdateSTS getAllSTS={getAllSTS} stsId={updateSTSId} sts={sts} />
          <CreateSTS getAllSTS={getAllSTS} />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={stss} />
      </div>
    </div>
  );
};

export default ManageSTS;
