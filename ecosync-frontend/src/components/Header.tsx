import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <nav className="bg-[#003F62] flex justify-between px-20 items-center gap-3 h-[80px]">
        <div className="flex items-center justify-center ">
          <Link
            to={"/"}
            className="text-3xl text-white cursor-pointer py-3 px-5 mr-3"
          >
            EcoSync
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            className="flex items-center text-white text-xl gap-2 hover:bg-[#1c3747] px-3 py-2 rounded-lg "
            to={"/"}
          >
            <FaHome />
            Dashboard
          </Link>
          <Link
            className="flex items-center text-white text-xl gap-2 hover:bg-[#1c3747] px-3 py-2 rounded-lg "
            to={"/"}
          >
            <FaHome />
            Manage STS
          </Link>
          <Link
            className="flex items-center text-white text-xl gap-2 hover:bg-[#1c3747] px-3 py-2 rounded-lg "
            to={"/"}
          >
            <FaHome />
            Manage Users
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
