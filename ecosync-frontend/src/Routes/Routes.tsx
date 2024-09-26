import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import Dashboard from "../pages/Dashboard";
import ManageUser from "../pages/Admin/ManageUser";
import ManageVehicle from "../pages/Admin/ManageVehicle";
import Profile from "../pages/Profile";
import ManageRoles from "../pages/Admin/ManageRoles";
import ManageSTS from "../pages/Admin/ManageSTS";
import ManageLandfill from "../pages/Admin/ManageLandfill";
import MySTS from "../pages/STSManager/MySTS";
// import AddEntries from "../pages/STSManager/AddEntries";
import CheckFleet from "../pages/STSManager/CheckFleet";
import CheckRoutes from "../pages/STSManager/CheckRoutes";
import AddTruckEntries from "../pages/LandfillManager/AddTruckEntries";
import MyLandfill from "../pages/LandfillManager/MyLandfill";
import GenerateBill from "../pages/LandfillManager/GenerateBill";
import STSDetails from "../pages/Admin/STSDetails";
import LandfillDetails from "../pages/Admin/LandfillDetails";
import ManageThirdPartyContractor from "../pages/ContractManager/ManageThirdPartyContractor";
import ManageWorkforce from "../pages/ContractManager/ManageWorkforce";
import WorkingHourRecords from "../pages/ContractManager/WorkingHourRecord";
import CollectionPlan from "../pages/ContractManager/CollectionPlan";
import Entries from "../pages/STSManager/Entries";
import Tracker from "../pages/ContractManager/Tracker";
import GenerateBillContractor from "../pages/STSManager/GenerateBillContractor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
      // Routes for Admin
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "manage-users",
        element: <ManageUser />,
      },
      {
        path: "manage-roles",
        element: <ManageRoles />,
      },
      {
        path: "manage-sts",
        element: <ManageSTS />,
      },
      {
        path: "manage-sts/:id",
        element: <STSDetails />,
      },
      {
        path: "manage-landfill",
        element: <ManageLandfill />,
      },
      {
        path: "manage-landfill/:id",
        element: <LandfillDetails />,
      },
      {
        path: "manage-vehicles",
        element: <ManageVehicle />,
      },

      // Routes for STS Manager
      {
        path: "manage-my-sts",
        element: <MySTS />,
      },
      // {
      //   path: "add-waste-entries",
      //   element: <AddEntries />,
      // },
      {
        path: "waste-entries",
        element: <Entries />,
      },
      {
        path: "check-routes",
        element: <CheckRoutes />,
      },
      {
        path: "check-fleet",
        element: <CheckFleet />,
      },

      // Routes for Landfill Manager
      {
        path: "manage-my-landfill",
        element: <MyLandfill />,
      },
      {
        path: "add-truck-entry",
        element: <AddTruckEntries />,
      },
      {
        path: "generate-bill",
        element: <GenerateBill />,
      },
      {
        path: "generate-bill-contractor",
        element: <GenerateBillContractor />,
      },

      // Routes for contract manager
      {
        path: "manage-third-party-contractors",
        element: <ManageThirdPartyContractor />,
      },
      {
        path: "manage-workforce",
        element: <ManageWorkforce />,
      },
      {
        path: "working-hour-logs",
        element: <WorkingHourRecords />,
      },
      {
        path: "collection-plan",
        element: <CollectionPlan />,
      },
      {
        path: "tracker",
        element: <Tracker />,
      },

      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
