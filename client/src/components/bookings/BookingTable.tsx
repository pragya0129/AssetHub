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
    id: number,
  ) => {

    if (
      !window.confirm(
        "Cancel this booking?"
      )
    )
      return;

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

  return (

    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">
              Resource
            </th>

            <th className="px-6 py-4 text-left">
              Booked By
            </th>

            <th className="px-6 py-4 text-left">
              Start
            </th>

            <th className="px-6 py-4 text-left">
              End
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {
            bookings.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-500"
                >
                  No bookings found.
                </td>

              </tr>

            ) : (

              bookings.map((booking) => (

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

                <td className="px-6 py-5">
  {booking.booked_by_name ?? "You"}
</td>

                  <td className="px-6 py-5">
                    {new Date(
                      booking.start_time
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    {new Date(
                      booking.end_time
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                        booking.current_status
                      )}`}
                    >
                      {booking.current_status}
                    </span>

                  </td>

                  <td className="px-6 py-5 text-center">

                    {
                      booking.current_status ===
                      "UPCOMING" ? (

                        <button
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

                      )
                    }

                  </td>

                </tr>

              ))

            )
          }

        </tbody>

      </table>

    </div>

  );

};

export default BookingTable;