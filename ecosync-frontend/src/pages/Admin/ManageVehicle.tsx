import { FaUserPlus } from "react-icons/fa";
import Table from "../../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import NewVehicle from "../../components/NewVehicle";
import axios from "axios";
import { RootState, server } from "../../redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UpdateVehicle from "../../components/UpdateVehicle";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "react-toastify";

export type Vehicle = {
  _id: string;
  registrationNumber: string;
  type: string;
  capacity: number;
  fuelCostPerKilometer: {
    fullyLoaded: number;
    unloaded: number;
  };
};
const ManageVehicle = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>();
  const [updateVehicleId, setUpdateVehicleId] = useState<string | null>(null);
  const getAllVehicles = async () => {
    try {
      const response = await axios.get(`${server}/vehicle`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    getAllVehicles();
  }, []);

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      const response = await axios.delete(`${server}/vehicle/${vehicleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 200) {
        toast.success("Vehicle deleted successfully");
        getAllVehicles();
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const columnHelper = createColumnHelper<Vehicle>();
  const columns = [
    columnHelper.accessor("registrationNumber", {
      header: () => "Registration Number",
      cell: (info) => info.row.original.registrationNumber,
    }),
    columnHelper.accessor("type", {
      header: () => "Type",
      cell: (info) => info.row.original.type,
    }),
    columnHelper.accessor("capacity", {
      header: () => "Capacity",
      cell: (info) => info.row.original.capacity,
    }),
    columnHelper.accessor("fuelCostPerKilometer.fullyLoaded", {
      header: () => "Cost/Km loaded",
      cell: (info) => info.row.original.fuelCostPerKilometer.fullyLoaded,
    }),
    columnHelper.accessor("fuelCostPerKilometer.unloaded", {
      header: () => "Cost/Km unloaded",
      cell: (info) => info.row.original.fuelCostPerKilometer.unloaded,
    }),
    columnHelper.accessor("_id", {
      header: () => "Update",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setUpdateVehicleId(info.row.original._id);
              setVehicle(info.row.original);
              const modal = document.getElementById("update-vehicle-modal");
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
            onClick={() => handleDeleteVehicle(info.row.original._id)}
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
              const modal = document.getElementById("new-vehicle-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Add New Vehicle
          </button>
          <NewVehicle getAllVehicles={getAllVehicles} />
          <UpdateVehicle
            vehicle={vehicle}
            updateVehicleId={updateVehicleId}
            getAllVehicles={getAllVehicles}
          />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={vehicles} />
      </div>
    </div>
  );
};

export default ManageVehicle;
