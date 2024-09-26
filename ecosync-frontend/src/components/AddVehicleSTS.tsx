import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddVehicleSTS = ({ getSTSVehicles, stsId }: any) => {
  const { register, handleSubmit, reset } = useForm<any>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [trucks, setTrucks] = useState<any>([]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const response = await axios.put(
        `${server}/sts/${stsId}/trucks`,
        {
          truckId: data.trucks,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response) {
        getSTSVehicles();
      }
      toast.success("Vehicle added to STS successfully");

      reset();

      const modal = document.getElementById("t-sts-modal");
      if (modal instanceof HTMLDialogElement) {
        modal.close();
      }
    } catch (error) {
      console.error("Error adding vehicle to STS:", error);
      toast.error("Failed to add vehicle to STS");
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
    getUnsignedTrucks();
  }, []);

  return (
    <div>
      <dialog id="t-sts-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Vehicle</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              {trucks && trucks.length > 0 ? (
                <>
                  <label className="input input-bordered flex items-center gap-2">
                    Trucks
                    <select
                      {...register("trucks", { required: true })}
                      className="grow"
                    >
                      {trucks.map((truck: any) => (
                        <option key={truck._id} value={truck?._id}>
                          {truck.registrationNumber}
                        </option>
                      ))}
                    </select>
                  </label>

                  <input
                    className="btn mt-2 w-full bg-green-500"
                    type="submit"
                    value="Create"
                  />
                </>
              ) : (
                <p>No trucks available. Please check back later.</p>
              )}
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

export default AddVehicleSTS;
