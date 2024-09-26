import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../../components/Table";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import AddCollectionPlanModal from "../../components/ContractManager/AddCollectionPlanModal";

export type CollectionPlan = {
  _id: string;
  areaOfCollection: string;
  collectionStartTime: Date;
  duration: number;
  numberOfLaborers: number;
  numberOfVans: number;
  expectedWeightOfSolidWaste: number;
};

const CollectionPlan = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  const [collectionPlans, setCollectionPlans] = useState<CollectionPlan[]>([]);

  const fetchCollectionPlans = async () => {
    try {
      const response = await axios.get(`${server}/collection-plans`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setCollectionPlans(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching collection plans:", error);
    }
  };

  useEffect(() => {
    fetchCollectionPlans();
  }, []);

  const handleDeleteCollectionPlan = async (planId: string) => {
    try {
      const response = await axios.delete(
        `${server}/collection-plans/${planId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Collection plan deleted successfully");
        fetchCollectionPlans();
      } else {
        toast.error("Failed to delete collection plan");
      }
    } catch (error) {
      console.error("Error deleting collection plan:", error);
    }
  };

  const columnHelper = createColumnHelper<CollectionPlan>();
  const columns = [
    columnHelper.accessor("areaOfCollection", {
      header: () => "Area of Collection",
      cell: (info) => info.row.original.areaOfCollection,
    }),
    columnHelper.accessor("collectionStartTime", {
      header: () => "Collection Start Time",
      cell: (info) =>
        new Date(info.row.original.collectionStartTime).toLocaleString(),
    }),
    columnHelper.accessor("duration", {
      header: () => "Duration (hours)",
      cell: (info) => info.row.original.duration,
    }),
    columnHelper.accessor("numberOfLaborers", {
      header: () => "Number of Laborers",
      cell: (info) => info.row.original.numberOfLaborers,
    }),
    columnHelper.accessor("numberOfVans", {
      header: () => "Number of Vans",
      cell: (info) => info.row.original.numberOfVans,
    }),
    columnHelper.accessor("expectedWeightOfSolidWaste", {
      header: () => "Expected Weight of Solid Waste (kg)",
      cell: (info) => info.row.original.expectedWeightOfSolidWaste,
    }),
    columnHelper.accessor("_id", {
      header: () => "Delete Plan",
      cell: (info) => (
        <button
          onClick={() => handleDeleteCollectionPlan(info.row.original._id)}
          className="btn btn-error text-white"
        >
          <RiDeleteBinFill />
        </button>
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
                "add-collection-plan-modal"
              );
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Add Plan
          </button>
          <AddCollectionPlanModal refreshPlans={fetchCollectionPlans} />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={collectionPlans} />
      </div>
    </div>
  );
};

export default CollectionPlan;
