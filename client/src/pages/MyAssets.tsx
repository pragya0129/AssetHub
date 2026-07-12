import { useEffect, useState } from "react";
import api from "../api/api";

interface Asset {
  id: number;
  asset_name: string;
  asset_tag: string;
  allocated_date: string;
  expected_return_date: string;
  status: string;
}

const MyAssets = () => {

  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {

    const load = async () => {

      try {

        const res = await api.get("/allocations/my-assets");

        setAssets(res.data.data);

      } catch (err) {

        console.log(err);

      }

    };

    load();

  }, []);

  return (

    <>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          My Assets

        </h1>

        <p className="mt-2 text-slate-500">

          Assets assigned to you

        </p>

      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        {assets.map((asset) => (

          <div
            key={asset.id}
            className="rounded-3xl border bg-white p-6 shadow-sm"
          >

            <h2 className="text-xl font-semibold">

              {asset.asset_name}

            </h2>

            <p className="mt-2 text-slate-500">

              {asset.asset_tag}

            </p>

            <div className="mt-5 space-y-2 text-sm">

              <p>

                <span className="font-medium">
                  Allocated:
                </span>{" "}

                {asset.allocated_date}

              </p>

              <p>

                <span className="font-medium">
                  Return:
                </span>{" "}

                {asset.expected_return_date}

              </p>

            </div>

            <div className="mt-5">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">

                {asset.status}

              </span>

            </div>

          </div>

        ))}

      </div>

    </>

  );

};

export default MyAssets;