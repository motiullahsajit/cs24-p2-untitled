import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import axios from "axios";
import { toast } from "react-toastify";

type Workforce = {
  _id: string;
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

const UpdateWorkforceModal = ({ workforce, onUpdate }: any) => {
  const { register, handleSubmit } = useForm<Workforce>({
    defaultValues: workforce,
  });
  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Workforce> = async (data) => {
    try {
      const response = await axios.put(
        `${server}/workforce/${workforce._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Workforce member updated successfully");
        onUpdate();
        const modal = document.getElementById(
          "update-workforce-modal"
        ) as HTMLDialogElement;
        modal.close();
      } else {
        toast.error("Failed to update workforce member");
      }
    } catch (error) {
      console.error("Error updating workforce member:", error);
      toast.error("Failed to update workforce member");
    }
  };

  return (
    <dialog id="update-workforce-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Update Workforce Member</h3>
        <div>
          <form
            method="dialog"
            className="py-4 flex flex-col gap-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <label className="input input-bordered flex items-center gap-2">
              Employee ID
              <input
                {...register("employeeId")}
                type="text"
                defaultValue={workforce.employeeId}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Full Name
              <input
                {...register("fullName")}
                type="text"
                defaultValue={workforce.fullName}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Date of Birth
              <input
                {...register("dateOfBirth")}
                type="date"
                defaultValue={workforce.dateOfBirth}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Job Title
              <input
                {...register("jobTitle")}
                type="text"
                defaultValue={workforce.jobTitle}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Payment Rate per Hour
              <input
                {...register("paymentRatePerHour")}
                type="number"
                defaultValue={workforce.paymentRatePerHour}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Phone Number
              <input
                {...register("phoneNumber")}
                type="text"
                defaultValue={workforce.phoneNumber}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Address
              <input
                {...register("address")}
                type="text"
                defaultValue={workforce.address}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              Assigned Collection Route
              <input
                {...register("assignedCollectionRoute")}
                type="text"
                defaultValue={workforce.assignedCollectionRoute}
                className="grow"
              />
            </label>
            <input
              className="btn mt-2 w-full bg-green-500"
              type="submit"
              value="Update"
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
  );
};

export default UpdateWorkforceModal;
