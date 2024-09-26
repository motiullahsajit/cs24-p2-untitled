import { FaUserCircle, FaUserPlus } from "react-icons/fa";
import UpdateProfile from "../components/UpdateProfile";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import { useEffect, useState } from "react";
import ChangePassword from "../components/ChangePassword";

type User = {
  username: string;
  password: string;
  role: string;
  email: string;
  name: string;
  phoneNumber: string;
  photoUrl: string;
};

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [currentUser, setCurrentUser] = useState<User>({
    username: "",
    password: "",
    role: "",
    email: "",
    name: "",
    phoneNumber: "",
    photoUrl: "",
  });
  const role = currentUser?.role;
  const displayRole =
    role === "system_admin"
      ? "System Admin"
      : role === "sts_manager"
      ? "STS Manager"
      : role === "landfill_manager"
      ? "Landfill Manager"
      : role;
  useEffect(() => {
    fetch(`${server}/users/${user?._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentUser(data);
      });
  }, [user]);

  return (
    <>
      <nav className="bg-light flex justify-end px-20 gap-3 h-[80px]">
        <div className="flex items-center justify-center ">
          <button
            onClick={() => {
              const modal = document.getElementById("change-password-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Change Password
          </button>
          <button
            onClick={() => {
              const modal = document.getElementById("update-profile-modal");
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="flex items-center text-xl gap-2 hover:bg-[#EDA415] px-3 py-2 rounded-lg "
          >
            <FaUserPlus />
            Update Profile
          </button>
        </div>
      </nav>
      <UpdateProfile />
      <ChangePassword />
      <div className="flex justify-around w-[45%] mx-auto items-start h-3/5 mt-10 gap-5">
        <div className="avatar mt-20">
          <div className="w-60 rounded-full">
            {currentUser?.photoUrl ? (
              <img src={currentUser?.photoUrl} alt="avatar" />
            ) : (
              <FaUserCircle className="text-[240px]" />
            )}
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        <div className="mt-28 flex flex-col gap-5">
          <p className="text-2xl">
            Name: {currentUser ? currentUser.name : null}
          </p>
          <p className="text-2xl">Email: {currentUser?.email}</p>
          <p className="text-2xl">Phone: {currentUser?.phoneNumber}</p>
          <p className="text-2xl">Role: {displayRole}</p>
        </div>
      </div>
    </>
  );
};

export default Profile;
