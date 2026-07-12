import {
    Router,
} from "express";


import {
    createBooking,
    getBookings,
    getMyBookings,
    getResourceBookings,
    cancelBooking,
} from "../controllers/bookingController.js";


import {
    protect,
    authorize,
} from "../middleware/authMiddleware.js";


const router =
    Router();


router.use(
    protect,
);

router.get(
    "/my-bookings",

    getMyBookings,
);


router.get(
    "/resource/:assetId",

    getResourceBookings,
);

router.get(
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    getBookings,
);

router.post(
    "/",

    createBooking,
);

router.patch(
    "/:id/cancel",

    cancelBooking,
);


export default router;