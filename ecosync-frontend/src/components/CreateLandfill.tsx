import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Landfill = {
  _id: string;
  name: string;
  capacity: number;
  operationalTimespan: string;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  landfillId: string;
};

const CreateLandfill = ({ getAllLandfill }: any) => {
  const { register, handleSubmit, reset } = useForm<Landfill>();
  const [managers, setManagers] = useState<any>([]);
  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Landfill> = async (data) => {
    try {
      const response = await axios.post(`${server}/landfills`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 201) {
        toast.success("Landfill added successfully");
        reset();
        getAllLandfill();
        const modal = document.getElementById("new-landfill-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add landfill to server");
      }
    } catch (error) {
      console.error("Error adding landfill:", error);
      toast.error("Failed to add landfills");
    }
  };

  const getUnsignedManagers = async () => {
    try {
      const response = await axios.get(
        `${server}/landfills/managers/unassigned`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      setManagers(response.data.landfillManagers);
    } catch (error) {
      console.error("Error getting manager data:", error);
    }
  };

  useEffect(() => {
    getUnsignedManagers();
  }, []);

  return (
    <div>
      <dialog id="new-landfill-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Landfill</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Landfill ID
                <input
                  {...register("landfillId")}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Name
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Managers
                <select
                  {...register("managers", { required: true })}
                  className="grow"
                >
                  {managers?.map((manager: any) => (
                    <option key={manager._id} value={manager?._id}>
                      {manager.username}
                    </option>
                  ))}
                </select>
              </label>

              <label className="input input-bordered flex items-center gap-2">
                Capacity
                <input
                  {...register("capacity", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Operational Time
                <input
                  {...register("operationalTimespan", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Location Latitude
                <input
                  {...register("location.latitude", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Location Longitude
                <input
                  {...register("location.longitude", { required: true })}
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

export default CreateLandfill;
