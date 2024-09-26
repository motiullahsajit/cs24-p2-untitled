import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { toast } from "react-toastify";

type Inputs = {
  registrationNumber: string;
  type: string;
  capacity: number;
  fuelCostPerKilometer: {
    fullyLoaded: number;
    unloaded: number;
  };
};

const NewVehicle = ({ getAllVehicles }: any) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(`${server}/vehicle`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });

      if (response.status === 201) {
        toast.success("Vehicle created successfully");
        reset();
        getAllVehicles();
        const modal = document.getElementById("new-vehicle-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to create vehicle");
      }
    } catch (error) {
      console.error("Error creating vehicle:", error);
      toast.error("Failed to create vehicle");
    }
  };

  return (
    <div>
      <dialog id="new-vehicle-modal" className="modal">
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
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Type
                <select
                  {...register("type", { required: true })}
                  className="grow"
                >
                  <option value="Truck">Truck</option>
                  <option value="Dump Truck">Dump Truck</option>
                  <option value="Compactor">Compactor</option>
                  <option value="Container Carrier">Container Carrier</option>
                </select>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Capacity
                <select
                  {...register("capacity", { required: true })}
                  className="grow"
                >
                  <option value="3">3 Tons</option>
                  <option value="5">5 Tons</option>
                  <option value="7">7 Tons</option>
                  <option value="15">15 Tons</option>
                </select>
              </label>

              <label className="input input-bordered flex items-center gap-2">
                Cost/Km Loaded
                <input
                  {...register("fuelCostPerKilometer.fullyLoaded", {
                    required: true,
                  })}
                  type="number"
                  className="grow"
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

export default NewVehicle;
