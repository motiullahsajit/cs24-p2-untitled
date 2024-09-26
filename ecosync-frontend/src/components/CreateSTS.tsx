import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type STS = {
  wardNumber: string;
  capacity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  managers: string[];
  trucks: string[];
  stsId: string;
};

const CreateSTS = ({ getAllSTS }: any) => {
  const { register, handleSubmit, reset } = useForm<STS>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [managers, setManagers] = useState<any>([]);
  const [trucks, setTrucks] = useState<any>([]);

  const onSubmit: SubmitHandler<STS> = async (data) => {
    try {
      const response = await axios.post(`${server}/sts`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.status === 201) {
        toast.success("STS added successfully");
        reset();
        getAllSTS();
        const modal = document.getElementById("new-sts-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add STS");
      }
    } catch (error) {
      console.error("Error adding STS:", error);
      toast.error("Failed to add STS");
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

  const getUnsignedTrucks = async () => {
    try {
      const response = await axios.get(`${server}/sts/vehicles/unassigned`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setTrucks(response.data.unassignedVehicles);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  useEffect(() => {
    getUnsignedManagers();
    getUnsignedTrucks();
  }, []);

  return (
    <div>
      <dialog id="new-sts-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New STS</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                STS ID
                <input {...register("stsId")} type="string" className="grow" />
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
                Trucks
                <select
                  {...register("trucks", { required: true })}
                  className="grow"
                >
                  {trucks?.map((truck: any) => (
                    <option key={truck._id} value={truck?._id}>
                      {truck.registrationNumber}
                    </option>
                  ))}
                </select>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Ward Number
                <input
                  {...register("wardNumber", { required: true })}
                  type="text"
                  className="grow"
                />
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

export default CreateSTS;
