import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { server } from "../redux/store";
import axios from "axios";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  username: string;
  phoneNumber: number;
  photoUrl: any;
};

const UpdateProfile = () => {
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const imageStorageKey = "a9e96cffb01065e5efdb260580e31b2a";
  const { user } = useSelector((state: RootState) => state.userReducer);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const image = data.photoUrl[0];
    const formData = new FormData();
    const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
    formData.append("image", image);

    try {
      const imgUploadResponse = await axios.post(url, formData);
      const img = imgUploadResponse.data.data.url;

      const updatedProfile: Partial<Inputs> = {};
      if (data.name) updatedProfile.name = data.name;
      if (data.username) updatedProfile.username = data.username;
      if (data.phoneNumber) updatedProfile.phoneNumber = data.phoneNumber;
      if (img) updatedProfile.photoUrl = img;

      const updateUserResponse = await axios.put(
        `${server}/users/${user?._id}`,
        updatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );

      if (updateUserResponse.data._id) {
        toast.success("Profile updated");
        reset();
        const modal = document.getElementById("update-profile-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <dialog id="update-profile-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Update Profile</h3>

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
                  placeholder="Your Name"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Username
                <input
                  {...register("username")}
                  type="text"
                  className="grow"
                  placeholder="youremail@mail.com"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Phone number
                <input
                  {...register("phoneNumber")}
                  type="number"
                  className="grow"
                  placeholder="123456789"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Photo
                <input
                  {...register("photoUrl")}
                  type="file"
                  className="grow"
                  placeholder="Upload your photo"
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

export default UpdateProfile;
