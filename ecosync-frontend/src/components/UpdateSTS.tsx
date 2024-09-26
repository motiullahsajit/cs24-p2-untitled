import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
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

const UpdateSTS = ({ sts, stsId, getAllSTS }: any) => {
  const { register, handleSubmit, reset } = useForm<STS>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<STS> = async (data) => {
    try {
      const response = await axios.put(`${server}/sts/${stsId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });

      if (response.status === 200) {
        toast.success("STS updated successfully");
        reset();
        getAllSTS();
        const modal = document.getElementById("update-sts-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to update STS");
      }
    } catch (error) {
      console.error("Error updating STS:", error);
      toast.error("Failed to update STS");
    }
  };

  return (
    <div>
      <dialog id="update-sts-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update STS Info</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Ward Number
                <input
                  {...register("wardNumber")}
                  type="text"
                  className="grow"
                  defaultValue={sts?.wardNumber}
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Capacity
                <input
                  {...register("capacity")}
                  type="number"
                  className="grow"
                  defaultValue={sts?.capacity.toString()}
                />
              </label>

              <label className="input input-bordered flex items-center gap-2">
                STS ID
                <input
                  {...register("stsId")}
                  type="number"
                  className="grow"
                  defaultValue={sts?.stsId}
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

export default UpdateSTS;
