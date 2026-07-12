import { useEffect, useState } from "react";

import api from "../api/api";

import AllocationTable from "../components/allocations/AllocationTable";
import AllocateAssetModal from "../components/allocations/AllocateAssetModal";

interface Allocation {
  id: number;
  asset_tag: string;
  asset_name: string;
  employee_name: string;
  department_name: string;
  allocated_date: string;
  expected_return_date: string;
  status: string;
}

const Allocations = () => {

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const loadAllocations = async () => {

    try {

      const res = await api.get("/allocations");

      setAllocations(res.data.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadAllocations();

  }, []);

  if (loading) {

    return (

      <div className="flex h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500">

            Loading allocations...

          </p>

        </div>

      </div>

    );

  }

  return (

    <>

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">

            Asset Allocations

          </h1>

          <p className="mt-2 text-slate-500">

            Manage employee asset assignments

          </p>

        </div>

        <button

          onClick={() => setOpen(true)}

          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"

        >

          + Allocate Asset

        </button>

      </div>

      <AllocationTable

        allocations={allocations}

      />

      {

        open && (

          <AllocateAssetModal

            close={() => setOpen(false)}

            refresh={loadAllocations}

          />

        )

      }

    </>

  );

};

export default Allocations;