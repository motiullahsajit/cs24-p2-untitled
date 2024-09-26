import { useState, useEffect } from "react";
import axios from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import Table from "../../components/Table";
import { RootState, server } from "../../redux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { SubmitHandler, useForm } from "react-hook-form";
import { GrDocumentUpdate } from "react-icons/gr";

interface Person {
  _id: string;
  mac: string;
  name: string;
  count: number;
}

const Tracker = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const { register, handleSubmit, reset } = useForm<Person>();

  const fetchTrackerData = async () => {
    try {
      const response = await axios.get<Person[]>(`${server}/tracker`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user?.token || "",
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchTrackerData, 1000);

    return () => clearInterval(interval);
  }, []);

  const onSubmit: SubmitHandler<Person> = async (data) => {
    try {
      setLoading(true);
      const response = await axios.put<Person>(
        `${server}/tracker/${data._id}`,
        { name: data.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user?.token || "",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Person renamed successfully");
        fetchTrackerData();
        reset();
        const modal = document.getElementById("rename-modal");
        if (modal instanceof HTMLDialogElement) {
          modal.close();
        }
      } else {
        toast.error("Failed to rename person");
      }
    } catch (error) {
      console.error("Error renaming:", error);
      toast.error("Failed to rename");
    } finally {
      setLoading(false);
    }
  };

  const columnHelper = createColumnHelper<Person>();
  const columns = [
    columnHelper.accessor("mac", {
      header: () => "MAC",
      cell: (info) => info.row.original.mac,
    }),
    columnHelper.accessor("name", {
      header: () => "Name",
      cell: (info) => {
        if (info.row.original.name.toLocaleLowerCase().startsWith("worker")) {
          return info.row.original.name;
        } else {
          return "Unknown";
        }
      },
    }),
    columnHelper.accessor("count", {
      header: () => "Count",
      cell: (info) => info.row.original.count,
    }),
    columnHelper.accessor("_id", {
      header: () => "Rename",
      cell: (info) => (
        <>
          <button
            onClick={() => {
              setSelectedPerson(info.row.original);
              const modal = document.getElementById("rename-modal");
              if (modal instanceof HTMLDialogElement) {
                modal.showModal();
              }
            }}
            className="btn btn-success text-white"
          >
            <GrDocumentUpdate />
          </button>
        </>
      ),
    }),
  ];

  return (
    <div>
      <Table columns={columns} data={data} />
      {selectedPerson && (
        <dialog id="rename-modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Rename Person</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className="input input-bordered flex items-center gap-2">
                New Name
                <input
                  {...register("name")}
                  type="text"
                  className="grow"
                  defaultValue={selectedPerson.name}
                />
              </label>
              <input
                className={`btn mt-2 w-full ${
                  loading ? "cursor-not-allowed" : "bg-green-500"
                }`}
                type="submit"
                value={loading ? "Renaming..." : "Rename"}
                disabled={loading}
              />
            </form>
            <button
              onClick={() => {
                setSelectedPerson(null);
                reset();
                const modal = document.getElementById("rename-modal");
                if (modal instanceof HTMLDialogElement) {
                  modal.close();
                }
              }}
              className="btn mt-2 w-full bg-red-500 text-white"
            >
              Close
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Tracker;
