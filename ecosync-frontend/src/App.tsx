import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import { RootState } from "./redux/store";
import "./styles/style.scss";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userExists } from "./redux/reducer/userReducer";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!user && storedUser) {
      dispatch(userExists(JSON.parse(storedUser)));
    } else if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      {user && (
        <>
          <div className="flex">
            <SideBar />
            <div className="flex-grow ml-[250px]">
              <Outlet />
              <ToastContainer />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
