import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { RootState, server } from "../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
type Inputs = {
  email: string;
};
const CreateUser = ({ allUsers }: any) => {
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(
        `${server}/users`,
        {
          email: data.email,
          role: "unassigned",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        allUsers();
        reset();
        const modal = document.getElementById("create-user-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    }
  };

  return (
    <div>
      <dialog id="create-user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create User</h3>

          <div>
            <form
              method="dialog"
              className="py-4 flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label className="input input-bordered flex items-center gap-2">
                Email
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="grow"
                  placeholder="mail@mail.com"
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

export default CreateUser;
