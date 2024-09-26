import { FaUserPlus } from "react-icons/fa";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../../components/Table";
import CreateUser from "../../components/CreateUser";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiDeleteBinFill } from "react-icons/ri";
import { toast } from "react-toastify";

export type User = {
  _id: string;
  username: string;
  role: string;
  email: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
};

type Role = {
  _id: string;
  displayName: string;
  name: string;
  permissions: string[];
};

const ManageUser = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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

  const allUsers = async () => {
    try {
      const response = await axios.get(`${server}/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    allRoles();
    allUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(
        `${server}/users/${userId}/roles`,
        { role: newRole },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      // Refresh users data after updating role
      allUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteSTS = async (userId: string) => {
    try {
      const response = await axios.delete(`${server}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 200) {
        toast.success("User deleted successfully");
        allUsers();
      } else {
        toast.error("Failed to delete User");
      }
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor("username", {
      header: () => "Username",
      cell: (info) => info.row.original.username,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.row.original.name,
    }),
    columnHelper.accessor("email", {
      header: () => "Email",
      cell: (info) => info.row.original.email,
    }),
    columnHelper.accessor("phoneNumber", {
      header: () => "Phone Number",
      cell: (info) => info.row.original.phoneNumber,
    }),
    columnHelper.accessor("role", {
      header: () => "Role",
      cell: (info) => info.row.original.role,
    }),
    columnHelper.accessor("_id", {
      header: () => "Update Role",
      cell: (info) => (
        <select
          className="select select-bordered select-sm"
          onChange={(e) =>
            handleRoleChange(info.row.original._id, e.target.value)
          }
          value={info.row.original.role}
        >
          {roles.map((role) => (
            <option key={role._id} value={role.name}>
              {role.displayName}
            </option>
          ))}
        </select>
      ),
    }),
    columnHelper.accessor("_id", {
      header: () => "Delete User",
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
              const modal = document.getElementById("create-user-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Create User
          </button>
          <CreateUser allUsers={allUsers} />
        </div>
      </nav>
      <div>
        <Table columns={columns} data={users} />
      </div>
    </div>
  );
};

export default ManageUser;
