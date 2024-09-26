import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import { createColumnHelper } from "@tanstack/react-table";
import DashTable from "../components/DashTable";
import Loader from "../components/Loader";

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

type STS = {
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

type User = {
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

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [landfills, setLandfills] = useState<Landfill[]>([]);
  const [stss, setStss] = useState<STS[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const getDashboardStats = async () => {
    try {
      const response = await axios.get(`${server}/dashboard-statistics`, {
        headers: {
          Authorization: user?.token || "",
        },
      });
      setStatistics(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching data");
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getDashboardStats();
    getAllLandfill();
    getAllSTS();
    allUsers();
    allRoles();
  }, []);

  const columnHelper = createColumnHelper<any>();

  const landfillColumns = [
    columnHelper.accessor("landfillId", {
      header: () => "Landfill Id",
      cell: (info) => info.row.original.landfillId,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => info.row.original.name,
    }),
    columnHelper.accessor("managers", {
      header: () => "Managers",
      cell: (info) => info.row.original.managers,
    }),
    columnHelper.accessor("capacity", {
      header: () => "Capacity",
      cell: (info) => info.row.original.capacity,
    }),
    columnHelper.accessor("operationalTimespan", {
      header: () => "Operational Timespan",
      cell: (info) => info.row.original.operationalTimespan,
    }),
  ];

  const stsColumns = [
    columnHelper.accessor("stsId", {
      header: () => "STS ID",
      cell: (info) => info.row.original.stsId,
    }),
    columnHelper.accessor("managers", {
      header: () => "Managers",
      cell: (info) => info.row.original.managers,
    }),
    columnHelper.accessor("capacity", {
      header: () => "Capacity",
      cell: (info) => info.row.original.capacity,
    }),
    columnHelper.accessor("wardNumber", {
      header: () => "Ward Number",
      cell: (info) => info.row.original.wardNumber,
    }),
    columnHelper.accessor("location.latitude", {
      header: () => "Latitude",
      cell: (info) => info.row.original.location.latitude,
    }),
  ];

  const usersColumn = [
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
  ];

  const rolesColumns = [
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
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!statistics) {
    return <div>No data available</div>;
  }

  return (
    <>
      <nav className="bg-light flex justify-center items-center px-4 sm:px-20 gap-3 h-[80px]">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </nav>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 px-4 sm:px-20 mx-auto mt-8">
        <div className="bg-light py-4 px-5 rounded-xl">
          <h3 className="text-2xl">STS Statistics</h3>
          <p>Total STS Count: {statistics?.stsStatistics?.length}</p>
        </div>
        <div className="bg-light py-4 px-5 rounded-xl">
          <h3 className="text-2xl">Landfill Statistics</h3>
          <p>Total Landfill Count: {statistics?.landfillStatistics?.length}</p>
        </div>
        <div className="bg-light py-4 px-5 rounded-xl">
          <h3 className="text-2xl">Daily Fuel Cost Statistics</h3>
          <p>
            Total Fuel Cost: {statistics?.dailyFuelCostStatistics?.totalCost}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 sm:px-20 mx-auto mt-8">
        <div>
          <div className="bg-light rounded-xl p-4">
            <DashTable
              tableName={`Landfills (${statistics?.landfillStatistics?.length})`}
              data={landfills}
              columns={landfillColumns}
            />
          </div>
        </div>
        <div>
          <div className="bg-light rounded-xl p-4">
            <DashTable
              tableName={`Secondary Transfer Station (${statistics?.stsStatistics?.length})`}
              data={stss}
              columns={stsColumns}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-4 sm:px-20 mx-auto mt-8">
        <div>
          <div className="bg-light rounded-xl p-4">
            <DashTable
              tableName={`Users (${users?.length})`}
              data={users.slice(0, 4)}
              columns={usersColumn}
            />
          </div>
        </div>
        <div>
          <div className="bg-light rounded-xl p-4">
            <DashTable
              tableName={`Roles (${roles?.length})`}
              data={roles.slice(0, 4)}
              columns={rolesColumns}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
