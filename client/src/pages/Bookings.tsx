import { useEffect, useMemo, useState } from "react";
import api from "../api/api";

import type { Booking } from "../types/booking";

import BookingTable from "../components/bookings/BookingTable";
import BookingFilters from "../components/bookings/BookingFilters";
import AddBookingModal from "../components/bookings/AddBookingModal";
import { useAuth } from "../context/AuthContext";

const Bookings = () => {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

    const { user } = useAuth();

const isAdmin =
  user?.role === "ADMIN" ||
  user?.role === "ASSET_MANAGER";

  const loadBookings = async () => {

    try {

      setLoading(true);

      const res = await api.get(
  isAdmin
    ? "/bookings"
    : "/bookings/my-bookings"
);

      setBookings(res.data.data);

    }

    catch (err) {

      console.log(err);

    }

    finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadBookings();

  }, []);

  const filteredBookings =
    useMemo(() => {

      return bookings.filter((booking) => {

        const matchesSearch =

          booking.resource_name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          booking.asset_tag
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =

          status === ""

          ||

          booking.current_status ===
          status;

        return (
          matchesSearch &&
          matchesStatus
        );

      });

    }, [
      bookings,
      search,
      status,
    ]);

  if (loading) {

    return (

      <div className="flex h-[70vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500">
            Loading Bookings...
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
            Resource Bookings
          </h1>

          <p className="mt-2 text-slate-500">
            Book and manage shared resources
          </p>

        </div>

      </div>

      <BookingFilters

        search={search}
        setSearch={setSearch}

        status={status}
        setStatus={setStatus}

        onAdd={() => setOpen(true)}

      />

      <BookingTable

        bookings={filteredBookings}
        refresh={loadBookings}

      />

      {

        open && (

          <AddBookingModal

            close={() => setOpen(false)}

            refresh={loadBookings}

          />

        )

      }

    </>

  );

};

export default Bookings;