import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

type Contractor = {
  companyName: string;
  contractId: string;
  registrationId: string;
  registrationDate: string;
  tin: string;
  contactNumber: string;
  workforceSize: number;
  paymentPerTonnage: number;
  requiredAmountPerDay: number;
  contractDuration: number;
  areaOfCollection: string;
  designatedSTS: string;
};

const CreateThirdPartyContractor = ({ allThirdPartyContractors }: any) => {
  const { register, handleSubmit, reset } = useForm<Contractor>();
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Contractor> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${server}/third-party-contractors`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Contractor added successfully");
        reset();
        setLoading(false);
        allThirdPartyContractors();
        const modal = document.getElementById(
          "create-third-party-contractor-modal"
        );
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to add contractor to server");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error adding contractor:", error);
      toast.error("Failed to add contractor");
      setLoading(false);
    }
  };

  return (
    <div>
      <dialog id="create-third-party-contractor-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Contractor</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Company Name
                <input
                  {...register("companyName", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contract ID
                <input
                  {...register("contractId", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Registration ID
                <input
                  {...register("registrationId", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Registration Date
                <input
                  {...register("registrationDate", { required: true })}
                  type="date"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                TIN
                <input
                  {...register("tin", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contact Number
                <input
                  {...register("contactNumber", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Workforce Size
                <input
                  {...register("workforceSize", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Payment Per Tonnage
                <input
                  {...register("paymentPerTonnage", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Required Amount Per Day
                <input
                  {...register("requiredAmountPerDay", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contract Duration
                <input
                  {...register("contractDuration", { required: true })}
                  type="number"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Area of Collection
                <input
                  {...register("areaOfCollection", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Designated STS
                <input
                  {...register("designatedSTS", { required: true })}
                  type="text"
                  className="grow"
                />
              </label>
              <input
                className="btn mt-2 w-full bg-green-500"
                type="submit"
                value={loading ? "Creating..." : "Add"}
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

export default CreateThirdPartyContractor;
