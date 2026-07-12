import { useEffect, useMemo, useState } from "react";

import api from "../api/api";

import type { Asset } from "../types/asset";

import AssetFilters from "../components/assets/AssetFilters";
import AssetTable from "../components/assets/AssetTable";
import AddAssetModal from "../components/assets/AddAssetModal";

const Assets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const loadAssets = async () => {
    try {
      setLoading(true);

      const res = await api.get("/assets");

      setAssets(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        asset.asset_tag
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "" ||
        asset.status === status;

      const matchesCategory =
        category === "" ||
        asset.category_name === category;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [assets, search, status, category]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading Assets...
          </p>

        </div>
      </div>
    );
  }

  return (
    <>
      {/* PAGE HEADER */}

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">
            Assets
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all enterprise assets
          </p>

        </div>

      </div>

      {/* FILTERS */}

      <AssetFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        onAdd={() => setOpen(true)}
      />

      {/* TABLE */}

      <AssetTable
        assets={filteredAssets}
      />

      {/* MODAL */}

      {open && (
        <AddAssetModal
          close={() => setOpen(false)}
          refresh={loadAssets}
        />
      )}
    </>
  );
};

export default Assets;