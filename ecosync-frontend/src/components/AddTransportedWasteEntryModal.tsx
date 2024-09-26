import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { RootState, server } from "../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

type TransportedWasteEntryFormData = {
  timeAndDateOfCollection: Date;
  amountCollectedKg: number;
  contractorId: string;
  typeOfWaste: string;
  designatedSTS: string;
  vehicleUsed: string;
};

const AddTransportedWasteEntryModal = ({ refreshData }: any) => {
  const { register, handleSubmit, reset } =
    useForm<TransportedWasteEntryFormData>();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<TransportedWasteEntryFormData> = async (
    data
  ) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/waste-entries`,
        data,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Transported waste entry added successfully");
        reset();
        refreshData();
        const modal = document.getElementById(
          "add-transported-waste-entry-modal"
        );
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add transported waste entry");
      }
    } catch (error) {
      console.error("Error adding transported waste entry:", error);
      toast.error("Failed to add transported waste entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="add-transported-waste-entry-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Transported Waste Entry</h3>
        <form
          method="dialog"
          className="py-4 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="input input-bordered flex items-center gap-2">
            Time of Collection
            <input
              {...register("timeAndDateOfCollection")}
              type="datetime-local"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Amount Collected (kg)
            <input
              {...register("amountCollectedKg")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Contractor ID
            <input {...register("contractorId")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Waste Type
            <input {...register("typeOfWaste")} type="text" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Designated STS
            <input
              {...register("designatedSTS")}
              type="text"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Vehicle Used
            <input {...register("vehicleUsed")} type="text" className="grow" />
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

export default AddTransportedWasteEntryModal;
