import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddManagerSTS = ({ getSTSMangers, stsId }: any) => {
  const { register, handleSubmit, reset } = useForm<any>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [managers, setManagers] = useState<any>([]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      const response = await axios.put(
        `${server}/sts/${stsId}/managers`,
        {
          managerId: data.managers,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response) {
        getSTSMangers();
      }
      toast.success("Managers assigned successfully");
      reset();
      const modal = document.getElementById("manager-sts-modal");
      if (modal instanceof HTMLDialogElement) {
        modal.close();
      }
    } catch (error) {
      console.error("Error assigning managers:", error);
      toast.error("Failed to assign managers");
    }
  };

  const getUnsignedManagers = async () => {
    try {
      const response = await axios.get(`${server}/sts/managers/unassigned`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setManagers(response.data.stsManagers);
    } catch (error) {
      console.error("Error getting manager data:", error);
    }
  };

  useEffect(() => {
    getUnsignedManagers();
  }, []);

  return (
    <div>
      <dialog id="manager-sts-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Manager</h3>
          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              {managers && managers.length > 0 ? (
                <>
                  <label className="input input-bordered flex items-center gap-2">
                    Managers
                    <select
                      {...register("managers", { required: true })}
                      className="grow"
                    >
                      {managers.map((manager: any) => (
                        <option key={manager._id} value={manager?._id}>
                          {manager.username}
                        </option>
                      ))}
                    </select>
                  </label>

                  <input
                    className="btn mt-2 w-full bg-green-500"
                    type="submit"
                    value="Add"
                  />
                </>
              ) : (
                <p>No managers available. Please check back later.</p>
              )}
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

export default AddManagerSTS;
