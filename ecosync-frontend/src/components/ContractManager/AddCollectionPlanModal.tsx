import React, { useState } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import { toast } from "react-toastify";

type CollectionPlanFormData = {
  areaOfCollection: string;
  collectionStartTime: Date;
  duration: number;
  numberOfLaborers: number;
  numberOfVans: number;
  expectedWeightOfSolidWaste: number;
};

type AddCollectionPlanModalProps = {
  refreshPlans: () => void;
};

const AddCollectionPlanModal: React.FC<AddCollectionPlanModalProps> = ({
  refreshPlans,
}) => {
  const { register, handleSubmit, reset } = useForm<CollectionPlanFormData>();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<CollectionPlanFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${server}/collection-plans`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 201) {
        toast.success("Collection plan added successfully");
        reset();
        refreshPlans();
        const modal = document.getElementById("add-collection-plan-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add collection plan");
      }
    } catch (error) {
      console.error("Error adding collection plan:", error);
      toast.error("Failed to add collection plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="add-collection-plan-modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add Collection Plan</h3>
        <form
          method="dialog"
          className="py-4 flex flex-col gap-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="input input-bordered flex items-center gap-2">
            Area of Collection
            <input
              {...register("areaOfCollection")}
              type="text"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Collection Start Time
            <input
              {...register("collectionStartTime")}
              type="datetime-local"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Duration
            <input {...register("duration")} type="number" className="grow" />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Number of Laborers
            <input
              {...register("numberOfLaborers")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Number of Vans
            <input
              {...register("numberOfVans")}
              type="number"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            Expected Weight of Solid Waste
            <input
              {...register("expectedWeightOfSolidWaste")}
              type="number"
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

export default AddCollectionPlanModal;
