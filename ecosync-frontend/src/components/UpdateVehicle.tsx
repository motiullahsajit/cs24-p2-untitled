import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { toast } from "react-toastify";

type Vehicle = {
  registrationNumber: string;
  type: string;
  capacity: number;
  fuelCostPerKilometer: {
    fullyLoaded: number;
    unloaded: number;
  };
};

const UpdateVehicle = ({ vehicle, updateVehicleId, getAllVehicles }: any) => {
  const { register, handleSubmit, reset } = useForm<Vehicle>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Vehicle> = async (data) => {
    try {
      const response = await axios.put(
        `${server}/vehicle/${updateVehicleId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Vehicle info updated successfully");
        getAllVehicles();
        reset();
        const modal = document.getElementById("update-vehicle-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to update vehicle info");
      }
    } catch (error) {
      console.error("Error updating vehicle info:", error);
      toast.error("Failed to update vehicle info");
    }
  };

  return (
    <div>
      <dialog id="update-vehicle-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Vehicle</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Registration Number
                <input
                  {...register("registrationNumber", { required: true })}
                  type="text"
                  className="grow"
                  defaultValue={vehicle?.registrationNumber}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Type
                <select
                  {...register("type", { required: true })}
                  className="grow"
                  value={vehicle?.type}
                >
                  <option value="Truck">Truck</option>
                  <option value="Carry Truck">Carry Truck</option>
                  <option value="Dump Truck">Dump Truck</option>
                </select>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Capacity
                <input
                  {...register("capacity", { required: true })}
                  type="number"
                  className="grow"
                  defaultValue={vehicle?.capacity}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Cost/Km Loaded
                <input
                  {...register("fuelCostPerKilometer.fullyLoaded", {
                    required: true,
                  })}
                  type="number"
                  className="grow"
                  defaultValue={vehicle?.fuelCostPerKilometer.fullyLoaded}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Cost/Km Unloaded
                <input
                  {...register("fuelCostPerKilometer.unloaded", {
                    required: true,
                  })}
                  type="number"
                  className="grow"
                  defaultValue={vehicle?.fuelCostPerKilometer.unloaded}
                />
              </label>
              <input
                className="btn mt-2 w-full bg-green-500"
                type="submit"
                value="Create"
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

export default UpdateVehicle;
