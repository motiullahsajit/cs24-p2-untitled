import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
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

const UpdateLandfill = ({ landfill, landfillId, getAllLandfill }: any) => {
  const { register, handleSubmit, reset } = useForm<Landfill>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Landfill> = async (data) => {
    try {
      const response = await axios.put(
        `${server}/landfills/${landfillId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Landfill updated successfully");
        reset();
        getAllLandfill();
        const modal = document.getElementById("update-landfill-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to update landfill");
      }
    } catch (error) {
      console.error("Error updating landfill:", error);
      toast.error("Failed to update landfill");
    }
  };

  return (
    <div>
      <dialog id="update-landfill-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update STS Info</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Name
                <input
                  {...register("name")}
                  type="text"
                  className="grow"
                  defaultValue={landfill?.name}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Capacity
                <input
                  {...register("capacity")}
                  type="number"
                  className="grow"
                  defaultValue={landfill?.capacity.toString()}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Landfill ID
                <input
                  {...register("landfillId")}
                  type="number"
                  className="grow"
                  defaultValue={landfill?.LandfillId}
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
    </div>
  );
};

export default UpdateLandfill;
