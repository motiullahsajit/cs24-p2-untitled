import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducer/userReducer";
import { server } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplate,
  validateCaptcha,
} from "react-simple-captcha";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [resetStep, setResetStep] = useState("login");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [timer, setTimer] = useState(300);
  const [loading, setLoading] = useState(false);
  const timerRef: any = useRef(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${server}/auth/login`, {
        username,
        password,
      });
      sessionStorage.setItem("user", JSON.stringify(response.data.user));
      dispatch(userExists(response.data.user));
      if (response) {
        if (response.data.user?.role === "system_admin") {
          navigate("/dashboard");
        } else if (response.data.user?.role === "sts_manager") {
          navigate("/profile");
        } else if (response.data.user?.role === "landfill_manager") {
          navigate("/profile");
        } else if (response.data.user?.role === "contract_manager") {
          navigate("/profile");
        } else if (response.data.user?.role === "unassigned") {
          setDisabled(true);
          setUsername("");
          setPassword("");
          setErrorMessage(
            "You are not assigned yet. Please wait or contact the System admin."
          );
        }
      }
    } catch (error: any) {
      console.error("Login failed:", error.response.data);
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateReset = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${server}/auth/reset-password/initiate`,
        {
          email,
        }
      );
      if (response?.data?.success === true) {
        toast.success(response?.data?.message);
        setResetStep("reset-confirm");
      } else {
        setResetStep("login");
      }
    } catch (error: any) {
      console.error("Initiate reset failed:", error.response.data);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post(`${server}/auth/reset-password/confirm`, {
        code: verificationCode,
        newPassword,
      });

      setResetStep("login");
      setErrorMessage(
        "Password reset successful. Please login with your new password."
      );
    } catch (error: any) {
      console.error("Password reset failed:", error.response.data);
      setErrorMessage(error.response.data.message);
    }
  };

  const handleValidateCaptcha = (e: any) => {
    const captcha = e.target.value;
    if (validateCaptcha(captcha)) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleSteps = (step: string) => {
    setResetStep(step);
    loadCaptchaEnginge(6);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => {
      clearTimer();
    };
  }, []);

  useEffect(() => {
    if (
      newPassword !== "" &&
      confirmNewPassword !== "" &&
      newPassword !== confirmNewPassword
    ) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage("");
    }
  }, [newPassword, confirmNewPassword]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <h1
          className="flex justify-center items-center pb-10 color-primary font-semi-bold"
          style={{ fontSize: "3.5rem" }}
        >
          EcoSync
        </h1>
        {resetStep === "login" && (
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-3 w-[400px] bg-light p-10 rounded-xl"
          >
            <p
              style={{
                color: "#EDA415",
                fontSize: ".9rem",
                fontWeight: "bold",
              }}
            >
              To login as System Admin use, <br /> username:
              systemAdmin,password: test
            </p>
            <p
              style={{
                color: "#EDA415",
                fontSize: ".9rem",
                fontWeight: "bold",
              }}
            >
              To login as STS Manager use, <br /> username: stsManager,password:
              test
            </p>
            <p
              style={{
                color: "#EDA415",
                fontSize: ".9rem",
                fontWeight: "bold",
              }}
            >
              To login as Landfill Manager use, <br /> username:
              landfillManager,password: test
            </p>
            <p
              style={{
                color: "#EDA415",
                fontSize: ".9rem",
                fontWeight: "bold",
              }}
            >
              To login as Contractor Manager use, <br /> username:
              contractManager, password: test
            </p>
            <label htmlFor="username">Username</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="form-control">
              <label className="label">
                <LoadCanvasTemplate />
              </label>
              <input
                onBlur={handleValidateCaptcha}
                type="text"
                name="captcha"
                placeholder="Captcha"
                className="input input-bordered"
              />
            </div>
            <button
              disabled={disabled}
              className={`h-[40px]  text-white px-3 rounded-xl ${
                disabled ? "bg-[#eda51586]" : "bg-[#EDA415]"
              }`}
              type="submit"
            >
              Login
            </button>
            <button
              onClick={() => handleSteps("initiate-reset")}
              className="h-[40px]  text-white px-3 rounded-xl bg-[#EDA415]"
              type="button"
            >
              Forgot Password?
            </button>
          </form>
        )}
        {resetStep === "initiate-reset" && (
          <form
            onSubmit={handleInitiateReset}
            className="flex flex-col gap-3 w-[400px] bg-light p-10 rounded-xl"
          >
            <label htmlFor="email">Email</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <div className="form-control">
              <label className="label">
                <LoadCanvasTemplate />
              </label>
              <input
                onBlur={handleValidateCaptcha}
                type="text"
                name="captcha"
                placeholder="Captcha"
                className="input input-bordered"
              />
            </div>
            <button
              disabled={disabled}
              className={`h-[40px]  text-white px-3 rounded-xl ${
                disabled ? "bg-[#eda51586]" : "bg-[#EDA415]"
              }`}
              type="submit"
            >
              Confirm
            </button>
            <button
              onClick={() => handleSteps("login")}
              className="h-[40px]  text-white px-3 rounded-xl bg-[#EDA415]"
              type="button"
            >
              Back to Login
            </button>
          </form>
        )}
        {resetStep === "reset-confirm" && (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-3 w-[400px] bg-light p-10 rounded-xl"
          >
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification Code"
              required
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
            />
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              className="h-[40px] px-3 rounded-xl"
              type="password"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              required
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <p>
              Time remaining: {Math.floor(timer / 60)}:
              {timer % 60 < 10 ? "0" + (timer % 60) : timer % 60}
            </p>
            <button
              className="h-[40px]  text-white px-3 rounded-xl bg-[#EDA415]"
              type="submit"
            >
              Reset Password
            </button>
            <button
              onClick={() => handleSteps("login")}
              className="h-[40px]  text-white px-3 rounded-xl bg-[#EDA415]"
              type="button"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
