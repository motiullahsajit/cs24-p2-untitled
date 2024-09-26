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
import { GrDocumentUpdate } from "react-icons/gr";
import CreateWorkforceModal from "../../components/ContractManager/CreateWorkforceModal";
import UpdateWorkforceModal from "../../components/ContractManager/UpdateWorkforceModal";

export type Workforce = {
  _id: string;
  employeeId: string;
  fullName: string;
  dateOfBirth: Date;
  dateOfHire: Date;
  jobTitle: string;
  paymentRatePerHour: number;
  phoneNumber: string;
  address: string;
  assignedCollectionRoute: string;
};

const ManageWorkforce = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  const [workforce, setWorkforce] = useState<any>([]);

  const [workforceMembers, setWorkforceMembers] = useState<Workforce[]>([]);

  const allWorkforceMembers = async () => {
    try {
      const response = await axios.get(`${server}/workforce`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setWorkforceMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching workforce members:", error);
    }
  };

  useEffect(() => {
    allWorkforceMembers();
  }, []);

  const handleDeleteWorkforceMember = async (memberId: string) => {
    try {
      const response = await axios.delete(`${server}/workforce/${memberId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 200) {
        toast.success("Workforce member deleted successfully");
        allWorkforceMembers();
      } else {
        toast.error("Failed to delete workforce member");
      }
    } catch (error) {
      console.error("Error deleting workforce member:", error);
    }
  };

  const columnHelper = createColumnHelper<Workforce>();
  const columns = [
    columnHelper.accessor("fullName", {
      header: () => "Full Name",
      cell: (info) => info.row.original.fullName,
    }),
    columnHelper.accessor("jobTitle", {
      header: () => "Job Title",
      cell: (info) => info.row.original.jobTitle,
    }),
    columnHelper.accessor("phoneNumber", {
      header: () => "Phone No.",
      cell: (info) => info.row.original.phoneNumber,
    }),
    columnHelper.accessor("_id", {
      header: () => "Update",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setWorkforce(info.row.original);
              const modal = document.getElementById("update-workforce-modal");
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
      header: () => "Delete Member",
      cell: (info) => (
        <>
          <button
            onClick={() => handleDeleteWorkforceMember(info.row.original._id)}
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
              const modal = document.getElementById("create-workforce-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Add Workforce Member
          </button>
          <CreateWorkforceModal allWorkforceMembers={allWorkforceMembers} />
          <UpdateWorkforceModal
            workforce={workforce}
            onUpdate={allWorkforceMembers}
          />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={workforceMembers} />
      </div>
    </div>
  );
};

export default ManageWorkforce;
