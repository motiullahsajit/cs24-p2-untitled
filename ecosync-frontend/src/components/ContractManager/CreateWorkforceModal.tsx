import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

type WorkforceFormData = {
  employeeId: string;
  fullName: string;
  dateOfBirth: string;
  dateOfHire: string;
  jobTitle: string;
  paymentRatePerHour: number;
  phoneNumber: string;
  address: string;
  assignedCollectionRoute: string;
};

const CreateWorkforceModal = ({ allWorkforceMembers }: any) => {
  const { register, handleSubmit, reset } = useForm<WorkforceFormData>();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<WorkforceFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/workforce`,
        {
          ...data,
          dateOfBirth: new Date(data.dateOfBirth),
          dateOfHire: new Date(data.dateOfHire),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Workforce member added successfully");
        reset();
        allWorkforceMembers();
        const modal = document.getElementById("create-workforce-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add workforce member");
      }
    } catch (error) {
      console.error("Error adding workforce member:", error);
      toast.error("Failed to add workforce member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="create-workforce-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create Workforce Member</h3>
        <form
          method="dialog"
          className="py-4 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="input input-bordered flex items-center gap-2">
            Employee ID
            <input {...register("employeeId")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Full Name
            <input {...register("fullName")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Date of Birth
            <input {...register("dateOfBirth")} type="date" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Job Title
            <input {...register("jobTitle")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Payment Rate per Hour
            <input
              {...register("paymentRatePerHour")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Phone Number
            <input {...register("phoneNumber")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Address
            <input {...register("address")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Assigned Collection Route
            <input
              {...register("assignedCollectionRoute")}
              type="text"
              className="grow"
            />
          </label>
          <input
            className={`btn mt-2 w-full ${
              loading ? "cursor-not-allowed" : "bg-green-500"
            }`}
            type="submit"
            value={loading ? "Creating..." : "Create"}
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

export default CreateWorkforceModal;
