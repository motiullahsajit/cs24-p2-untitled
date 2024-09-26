import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import axios from "axios";
import { toast } from "react-toastify";

type Contractor = {
  _id: string;
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

const UpdateThirdPartyContractor = ({ contractor, onUpdate }: any) => {
  console.log(contractor);
  const { register, handleSubmit } = useForm<Contractor>({
    defaultValues: contractor,
  });
  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Contractor> = async (data) => {
    try {
      const response = await axios.put(
        `${server}/third-party-contractors/${contractor._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Contractor updated successfully");
        onUpdate();
        const modal = document.getElementById(
          "update-third-party-contractor-modal"
        );
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to update contractor");
      }
    } catch (error) {
      console.error("Error updating contractor:", error);
      toast.error("Failed to update contractor");
    }
  };

  return (
    <div>
      <dialog id="update-third-party-contractor-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Contractor</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Company Name
                <input
                  {...register("companyName")}
                  type="text"
                  defaultValue={contractor.companyName}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contract ID
                <input
                  {...register("contractId")}
                  type="text"
                  defaultValue={contractor.contractId}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Registration ID
                <input
                  {...register("registrationId")}
                  type="text"
                  defaultValue={contractor.registrationId}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Registration Date
                <input
                  {...register("registrationDate")}
                  type="date"
                  defaultValue={contractor.registrationDate}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                TIN
                <input
                  {...register("tin")}
                  type="text"
                  defaultValue={contractor.tin}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contact Number
                <input
                  {...register("contactNumber")}
                  type="text"
                  defaultValue={contractor.contactNumber}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Workforce Size
                <input
                  {...register("workforceSize")}
                  type="number"
                  defaultValue={contractor.workforceSize}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Payment Per Tonnage
                <input
                  {...register("paymentPerTonnage")}
                  type="number"
                  defaultValue={contractor.paymentPerTonnage}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Required Amount Per Day
                <input
                  {...register("requiredAmountPerDay")}
                  type="number"
                  defaultValue={contractor.requiredAmountPerDay}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Contract Duration
                <input
                  {...register("contractDuration")}
                  type="number"
                  defaultValue={contractor.contractDuration}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Area of Collection
                <input
                  {...register("areaOfCollection")}
                  type="text"
                  defaultValue={contractor.areaOfCollection}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Designated STS
                <input
                  {...register("designatedSTS")}
                  type="text"
                  defaultValue={contractor.designatedSTS}
                  className="grow"
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

export default UpdateThirdPartyContractor;
