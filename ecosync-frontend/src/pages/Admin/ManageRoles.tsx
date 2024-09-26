import { FaUserPlus } from "react-icons/fa";
import CreateRole from "../../components/CreateRole";
import { createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import Table from "../../components/Table";
import axios from "axios";
import UpdateRole from "../../components/UpdateRole";
import { GrDocumentUpdate } from "react-icons/gr";
import { toast } from "react-toastify";

type Role = {
  _id: string;
  displayName: string;
  name: string;
  permissions: string[];
};

const ManageRoles = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [roles, setRoles] = useState<Role[]>([]);
  const columnHelper = createColumnHelper<Role>();
  const [updateRoleId, setUpdateRoleId] = useState<string | null>(null);

  const columns = [
    columnHelper.accessor("displayName", {
      header: () => "Display Name",
      cell: (info) => info.row.original.displayName,
    }),
    columnHelper.accessor("name", {
      header: () => " Name",
      cell: (info) => info.row.original.name,
    }),
    columnHelper.accessor("permissions", {
      header: () => "Permission",
      cell: (info) => info.row.original.permissions,
    }),
    columnHelper.accessor("_id", {
      header: () => "Update",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setUpdateRoleId(info.row.original._id);
              const modal = document.getElementById("update-role-modal");
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
    columnHelper.accessor("permissions", {
      header: () => "Delete",
      cell: (info) => (
        <>
          <button
            onClick={() => handleDeleteRole(info.row.original._id)}
            className="btn btn-error"
          >
            Delete
          </button>
        </>
      ),
    }),
  ];

  const allRoles = async () => {
    try {
      const response = await axios.get(`${server}/rbac/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  // Fetch all roles
  useEffect(() => {
    allRoles();
  }, []);

  // Role deleting function
  const handleDeleteRole = async (roleId: string) => {
    try {
      const response = await axios.delete(`${server}/rbac/roles/${roleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 200) {
        toast.success("Role deleted successfully");
        allRoles();
      } else {
        toast.error("Failed to delete role");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  return (
    <>
      <nav className="bg-light flex justify-end px-20 gap-3 h-[80px]">
        <div className="flex items-center justify-center ">
          <button
            onClick={() => {
              const modal = document.getElementById("create-role-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Create Role
          </button>
        </div>
      </nav>
      <UpdateRole roleId={updateRoleId} allRoles={allRoles} />
      <CreateRole allRoles={allRoles} />
      <Table columns={columns} data={roles} />
    </>
  );
};

export default ManageRoles;
