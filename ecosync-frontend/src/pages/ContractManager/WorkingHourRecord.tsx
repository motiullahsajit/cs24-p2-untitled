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
import AddWorkingHourRecordModal from "../../components/ContractManager/AddWorkingHourRecordModal";

export type LoggedWorkingHourRecord = {
  _id: string;
  logInTime: Date;
  logOutTime: Date;
  totalHoursWorked: number;
  overtimeHours: number;
  absencesAndLeaves: string;
};

const WorkingHourRecord = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  //   const [loggedWorkingHours, setLoggedWorkingHours] = useState<any>([]);

  const [loggedWorkingHourRecords, setLoggedWorkingHourRecords] = useState<
    LoggedWorkingHourRecord[]
  >([]);

  const allLoggedWorkingHourRecords = async () => {
    try {
      const response = await axios.get(`${server}/logged-working-hours`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setLoggedWorkingHourRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logged working hour records:", error);
    }
  };

  useEffect(() => {
    allLoggedWorkingHourRecords();
  }, []);

  const handleDeleteLoggedWorkingHourRecord = async (recordId: string) => {
    try {
      const response = await axios.delete(
        `${server}/logged-working-hours/${recordId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Logged working hour record deleted successfully");
        allLoggedWorkingHourRecords();
      } else {
        toast.error("Failed to delete logged working hour record");
      }
    } catch (error) {
      console.error("Error deleting logged working hour record:", error);
    }
  };

  const columnHelper = createColumnHelper<LoggedWorkingHourRecord>();
  const columns = [
    columnHelper.accessor("logInTime", {
      header: () => "Log In Time",
      cell: (info) => new Date(info.row.original.logInTime).toLocaleString(),
    }),
    columnHelper.accessor("logOutTime", {
      header: () => "Log Out Time",
      cell: (info) => new Date(info.row.original.logInTime).toLocaleString(),
    }),
    columnHelper.accessor("totalHoursWorked", {
      header: () => "Total Hours Worked",
      cell: (info) => info.row.original.totalHoursWorked,
    }),
    columnHelper.accessor("overtimeHours", {
      header: () => "Overtime Hours",
      cell: (info) => info.row.original.overtimeHours,
    }),
    columnHelper.accessor("absencesAndLeaves", {
      header: () => "Absences and Leaves",
      cell: (info) => info.row.original.absencesAndLeaves,
    }),
    columnHelper.accessor("_id", {
      header: () => "Delete Record",
      cell: (info) => (
        <>
          <button
            onClick={() =>
              handleDeleteLoggedWorkingHourRecord(info.row.original._id)
            }
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
                "add-working-hours-record-modal"
              );
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Add Log
          </button>
          <AddWorkingHourRecordModal
            refreshData={allLoggedWorkingHourRecords}
          />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={loggedWorkingHourRecords} />
      </div>
    </div>
  );
};

export default WorkingHourRecord;
