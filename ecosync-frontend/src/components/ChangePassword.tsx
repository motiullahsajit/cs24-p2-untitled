import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import { toast } from "react-toastify";

type Inputs = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const ChangePassword = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null);
    setSuccess(false);

    if (data.newPassword !== data.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${server}/auth/change-password`,
        {
          userId: user?._id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        toast.success("Password Changed");
        reset();
        const modal = document.getElementById("change-password-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        setError("Failed to change password.");
      }
    } catch (error) {
      console.error("Error Changing Password:", error);
      setError("Failed to change password.");
    }
  };

  return (
    <div>
      <dialog id="change-password-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Change Password</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Old Password
                <input
                  {...register("oldPassword")}
                  type="password"
                  className="grow"
                  placeholder="Old Password"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                New Password
                <input
                  {...register("newPassword")}
                  type="password"
                  className="grow"
                  placeholder="New Password"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Confirm New Password
                <input
                  {...register("confirmNewPassword")}
                  type="password"
                  className="grow"
                  placeholder="Confirm New Password"
                />
              </label>
              {error && <p className="text-red-500">{error}</p>}
              {success && (
                <p className="text-green-500">Password changed successfully.</p>
              )}
              <input
                className="btn mt-2 w-full bg-green-500"
                type="submit"
                value="Change Password"
              />
            </form>

            <form method="dialog">
              <button className="btn mt-2 w-full bg-red-500 text-white">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChangePassword;
