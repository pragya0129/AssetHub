import api from "../../api/api";
import type { Booking } from "../../types/booking";

interface Props {
  bookings: Booking[];
  refresh: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "UPCOMING":
      return "bg-blue-100 text-blue-700";

    case "ONGOING":
      return "bg-green-100 text-green-700";

    case "COMPLETED":
      return "bg-slate-200 text-slate-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const BookingTable = ({
  bookings,
  refresh,
}: Props) => {
  const cancelBooking = async (
    id: number
  ) => {
    if (
      !window.confirm(
        "Cancel this booking?"
      )
    ) {
      return;
    }

    try {
      await api.patch(
        `/bookings/${id}/cancel`
      );

      refresh();
    } catch (err) {
      console.log(err);

      alert(
        "Unable to cancel booking"
      );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-slate-500 shadow-sm sm:rounded-3xl">
        No bookings found.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-bold text-slate-900">
                  {booking.resource_name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {booking.asset_tag}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                  booking.current_status
                )}`}
              >
                {booking.current_status}
              </span>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Booked By
              </p>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {booking.booked_by_name ??
                  "You"}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Start
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                  {new Date(
                    booking.start_time
                  ).toLocaleString()}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  End
                </p>

                <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                  {new Date(
                    booking.end_time
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {booking.current_status ===
              "UPCOMING" && (
                <button
                  type="button"
                  onClick={() =>
                    cancelBooking(
                      booking.id
                    )
                  }
                  className="mt-5 w-full rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  Cancel Booking
                </button>
              )}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-4 text-left">
                Resource
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left">
                Booked By
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left">
                Start
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left">
                End
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-left">
                Status
              </th>

              <th className="whitespace-nowrap px-6 py-4 text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <h3 className="font-semibold">
                    {booking.resource_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {booking.asset_tag}
                  </p>
                </td>

                <td className="whitespace-nowrap px-6 py-5">
                  {booking.booked_by_name ??
                    "You"}
                </td>

                <td className="whitespace-nowrap px-6 py-5">
                  {new Date(
                    booking.start_time
                  ).toLocaleString()}
                </td>

                <td className="whitespace-nowrap px-6 py-5">
                  {new Date(
                    booking.end_time
                  ).toLocaleString()}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      booking.current_status
                    )}`}
                  >
                    {booking.current_status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-5 text-center">
                  {booking.current_status ===
                    "UPCOMING" ? (
                    <button
                      type="button"
                      onClick={() =>
                        cancelBooking(
                          booking.id
                        )
                      }
                      className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingTable;