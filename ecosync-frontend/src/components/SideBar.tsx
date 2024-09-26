import { FaRoute, FaUserCircle, FaUserTie, FaWarehouse } from "react-icons/fa";
import {
  FaFileContract,
  FaMoneyBill1Wave,
  FaTruckArrowRight,
  FaTruckFront,
} from "react-icons/fa6";
import { GiMineTruck, GiNuclearWaste } from "react-icons/gi";
import { GoOrganization } from "react-icons/go";
import { GrUserAdmin } from "react-icons/gr";
import { ImBin } from "react-icons/im";
import { IoIosPeople } from "react-icons/io";
import { RiDashboardFill, RiTeamFill } from "react-icons/ri";
import { TbBuildingFactory } from "react-icons/tb";
import { TbLogout2 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import { userNotExits } from "../redux/reducer/userReducer";
import axios from "axios";
import { useEffect, useState } from "react";
import { IoTimerSharp } from "react-icons/io5";

const SideBar = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stsAssigned, setStsAssigned] = useState<any>(false);
  const [landfillAssigned, setLandfillAssigned] = useState<any>(false);

  const handleLogout = async () => {
    try {
      const token = user?.token;

      if (!token) {
        throw new Error("Token is missing.");
      }

      const response: any = await axios.get(
        `${server}/auth/logout`,

        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response?.data?.success === true) {
        sessionStorage.removeItem("user");
        dispatch(userNotExits());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getSTS = async () => {
    try {
      const response: any = await axios.get<any>(
        `${server}/sts/details/${user?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response) {
        setStsAssigned(true);
      }
    } catch (error) {
      setStsAssigned(false);
      console.error("Error fetching STS overview:", error);
    }
  };

  const getLandfill = async () => {
    try {
      const response = await axios.get<any>(
        `${server}/landfill/details/${user?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response) {
        setLandfillAssigned(true);
      }
    } catch (error) {
      setLandfillAssigned(false);
      console.error("Error fetching Landfill overview:", error);
    }
  };

  useEffect(() => {
    getSTS();
    getLandfill();
  }, [user]);

  return (
    <nav className="bg-primary w-[250px] h-screen fixed">
      <div className="flex items-center justify-center ">
        <h2 className="text-3xl text-white cursor-pointer py-3 px-5 mr-3">
          EcoSync
        </h2>
      </div>
      <hr className="border-[#EDA415] border-[3px] w-full mb-10" />
      <ul className="flex flex-col gap-2 text-white text-lg px-5">
        <Link
          to="profile"
          className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
        >
          <FaUserCircle />
          <li>{user ? user.username : "UserName"}</li>
        </Link>

        {/* For System Admin Role */}

        {user?.role === "system_admin" && (
          <>
            <Link
              to="dashboard"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <RiDashboardFill />
              <li>Dashboard</li>
            </Link>

            <Link
              to="manage-users"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <IoIosPeople />
              <li>Manage User</li>
            </Link>

            <Link
              to="manage-roles"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <GrUserAdmin />
              <li>Manage Roles</li>
            </Link>
            <Link
              to="manage-sts"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <GoOrganization />
              <li>Manage STS</li>
            </Link>
            <Link
              to="manage-landfill"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaUserTie />
              <li>Manage Landfill</li>
            </Link>
            <Link
              to="manage-vehicles"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <GiMineTruck />
              <li>Manage Vehicle</li>
            </Link>
          </>
        )}

        {/* For STS Manager Role */}
        {user?.role === "sts_manager" && stsAssigned && (
          <>
            <Link
              to="manage-my-sts"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaWarehouse />
              <li>STS Overview</li>
            </Link>
            <Link
              to="waste-entries"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <ImBin />
              <li>Entries</li>
            </Link>
            <Link
              to="check-routes"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaRoute />
              <li>Check Routes</li>
            </Link>
            <Link
              to="check-fleet"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaTruckFront />
              <li>Check Fleet</li>
            </Link>
            <Link
              to="generate-bill-contractor"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaMoneyBill1Wave />
              <li>Generate Bill</li>
            </Link>
          </>
        )}
        {/* Landfill Manager Role */}
        {user?.role === "landfill_manager" && landfillAssigned && (
          <>
            <Link
              to="manage-my-landfill"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <TbBuildingFactory />
              <li>Landfill Overview</li>
            </Link>
            <Link
              to="add-truck-entry"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaTruckArrowRight />
              <li>Add Truck Entry</li>
            </Link>
            <Link
              to="generate-bill"
              className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaMoneyBill1Wave />
              <li>Generate Bill</li>
            </Link>
          </>
        )}

        {/* For Contract manager role */}
        {user?.role === "contract_manager" && (
          <>
            <Link
              to="tracker"
              className="flex text-[17px] items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaFileContract />
              <li>Tracker</li>
            </Link>
            <Link
              to="manage-third-party-contractors"
              className="flex text-[17px] items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <FaFileContract />
              <li>Contractors</li>
            </Link>
            <Link
              to="manage-workforce"
              className="flex text-[17px] items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <RiTeamFill />
              <li>Manage Workforce</li>
            </Link>
            <Link
              to="working-hour-logs"
              className="flex text-[17px] items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <IoTimerSharp />
              <li>Working Hours</li>
            </Link>
            <Link
              to="collection-plan"
              className="flex text-[17px] items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg"
            >
              <GiNuclearWaste />
              <li>Collection Plan</li>
            </Link>
          </>
        )}

        <li
          className="flex items-center gap-2 hover:bg-[#EDA415] hover:text-black px-4 py-2 rounded-lg cursor-pointer"
          onClick={handleLogout}
        >
          <TbLogout2 />
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default SideBar;
