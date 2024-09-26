import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { RootState, server } from "../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

type Inputs = {
  displayName: string;
  name: string;
  permissions: string[];
};

const CreateRole = ({ allRoles }: any) => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(`${server}/rbac/roles`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      if (response.data.success) {
        toast.success("Role saved successfully");
        allRoles();
        reset();
        const modal = document.getElementById("create-role-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to save role");
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to save role");
    }
  };

  return (
    <>
      <dialog id="create-role-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create Role</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Display Name:
                <input
                  {...register("displayName", { required: true })}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Name:
                <input
                  {...register("name", { required: true })}
                  className="grow"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Permissions:
                <input
                  {...register("permissions", { required: true })}
                  className="grow"
                  placeholder="Separate permissions with commas"
                />
              </label>
              <button className="btn mt-2 w-full bg-green-500" type="submit">
                Create Role
              </button>
            </form>
            <form method="dialog">
              <button className="btn mt-2 w-full bg-red-500 text-white">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CreateRole;
