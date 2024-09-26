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
import CreateThirdPartyContractor from "../../components/ContractManager/CreateThirdPartyContractor";
import { GrDocumentUpdate } from "react-icons/gr";
import UpdateThirdPartyContractor from "../../components/ContractManager/UpdateThirdPartyContractor";

export type ThirdPartyContractor = {
  _id: string;
  companyName: string;
  contractId: string;
  registrationId: string;
  registrationDate: Date;
  tin: string;
  contactNumber: string;
  workforceSize: number;
  paymentPerTonnage: number;
  requiredAmountPerDay: number;
  contractDuration: number;
  areaOfCollection: string[];
  designatedSTS: string;
};

const ManageThirdPartyContractor = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(true);
  const [contractor, setContractor] = useState<any>([]);

  const [thirdPartyContractors, setThirdPartyContractors] = useState<
    ThirdPartyContractor[]
  >([]);

  const allThirdPartyContractors = async () => {
    try {
      const response = await axios.get(`${server}/third-party-contractors`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setThirdPartyContractors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching third-party contractors:", error);
    }
  };

  useEffect(() => {
    allThirdPartyContractors();
  }, []);

  const handleDeleteThirdPartyContractor = async (contractorId: string) => {
    try {
      const response = await axios.delete(
        `${server}/third-party-contractors/${contractorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Third-party contractor deleted successfully");
        allThirdPartyContractors();
      } else {
        toast.error("Failed to delete third-party contractor");
      }
    } catch (error) {
      console.error("Error deleting third-party contractor:", error);
    }
  };

  const columnHelper = createColumnHelper<ThirdPartyContractor>();
  const columns = [
    columnHelper.accessor("companyName", {
      header: () => "Company Name",
      cell: (info) => info.row.original.companyName,
    }),
    columnHelper.accessor("contactNumber", {
      header: () => "Phone No.",
      cell: (info) => info.row.original.contactNumber,
    }),
    columnHelper.accessor("_id", {
      header: () => "Update",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setContractor(info.row.original);
              const modal = document.getElementById(
                "update-third-party-contractor-modal"
              );
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
      header: () => "Delete Contractor",
      cell: (info) => (
        <>
          <button
            onClick={() =>
              handleDeleteThirdPartyContractor(info.row.original._id)
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
                "create-third-party-contractor-modal"
              );
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Create Third-party Contractor
          </button>
          <CreateThirdPartyContractor
            allThirdPartyContractors={allThirdPartyContractors}
          />
          <UpdateThirdPartyContractor
            contractor={contractor}
            onUpdate={allThirdPartyContractors}
          />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={thirdPartyContractors} />
      </div>
    </div>
  );
};

export default ManageThirdPartyContractor;
