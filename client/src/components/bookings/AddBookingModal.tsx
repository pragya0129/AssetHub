import { useEffect, useState } from "react";
import api from "../../api/api";

interface Asset {
  id: number;
  name: string;
  asset_tag: string;
  is_bookable: boolean;
}

interface Props {
  close: () => void;
  refresh: () => void;
}

const AddBookingModal = ({
  close,
  refresh,
}: Props) => {

  const [resources, setResources] =
    useState<Asset[]>([]);

  const [form, setForm] =
    useState({

      assetId: "",

      startTime: "",

      endTime: "",

      purpose: "",

    });

  useEffect(() => {

    loadResources();

  }, []);

  const loadResources = async () => {

    try {

      const res =
        await api.get("/assets");

      const bookable =
        res.data.data.filter(
          (asset: Asset) =>
            asset.is_bookable
        );

      setResources(bookable);

    }

    catch (err) {

      console.log(err);

    }

  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;

    setForm({

      ...form,

      [name]: value,

    });

  };

  const saveBooking = async () => {

    try {

      await api.post(
        "/bookings",
        {
          ...form,
          assetId: Number(
            form.assetId
          ),
        }
      );

      refresh();

      close();

    }

    catch (err) {

      console.log(err);

      alert(
        "Unable to create booking"
      );

    }

  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[650px] rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="text-3xl font-bold">
          Book Resource
        </h2>

        <div className="mt-8 space-y-5">

          <select
            name="assetId"
            value={form.assetId}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          >

            <option value="">
              Select Resource
            </option>

            {
              resources.map(
                (resource) => (

                  <option
                    key={resource.id}
                    value={resource.id}
                  >

                    {resource.asset_tag}
                    {" - "}
                    {resource.name}

                  </option>

                )
              )
            }

          </select>

          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

          <input
            name="purpose"
            placeholder="Purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full rounded-xl border p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <button
            onClick={close}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            onClick={saveBooking}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white"
          >
            Book Resource
          </button>

        </div>

      </div>

    </div>

  );

};

export default AddBookingModal;