import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

type LoggedWorkingHoursFormData = {
  logInTime: string;
  logOutTime: string;
  totalHoursWorked: number;
  overtimeHours: number;
  absencesAndLeaves: string;
};

const AddWorkingHourRecordModal = ({ refreshData }: any) => {
  const { register, handleSubmit, reset } =
    useForm<LoggedWorkingHoursFormData>();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<LoggedWorkingHoursFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/logged-working-hours`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Logged working hours record added successfully");
        reset();
        refreshData();
        const modal = document.getElementById("add-working-hours-record-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add logged working hours record");
      }
    } catch (error) {
      console.error("Error adding logged working hours record:", error);
      toast.error("Failed to add logged working hours record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="add-working-hours-record-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Working Hours Record</h3>
        <form
          method="dialog"
          className="py-4 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="input input-bordered flex items-center gap-2">
            Log-in Time
            <input
              {...register("logInTime")}
              type="datetime-local"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Log-out Time
            <input
              {...register("logOutTime")}
              type="datetime-local"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Total Hours Worked
            <input
              {...register("totalHoursWorked")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Overtime Hours
            <input
              {...register("overtimeHours")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Absences and Leaves
            <input
              {...register("absencesAndLeaves")}
              type="text"
              className="grow"
            />
          </label>
          <input
            className={`btn mt-2 w-full ${
              loading ? "cursor-not-allowed" : "bg-green-500"
            }`}
            type="submit"
            value={loading ? "Adding..." : "Add"}
            disabled={loading}
          />
        </form>
        <form method="dialog">
          <button className="btn mt-2 w-full bg-red-500 text-white">
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddWorkingHourRecordModal;
