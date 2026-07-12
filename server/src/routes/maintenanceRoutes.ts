import {
    Router,
} from "express";


import {
    createMaintenanceRequest,
    getMaintenanceRequests,
    getMyMaintenanceRequests,
    updateMaintenanceStatus,
} from "../controllers/maintenanceController.js";


import {
    protect,
    authorize,
} from "../middleware/authMiddleware.js";


const router =
    Router();


router.use(protect,);

router.get(
    "/my-requests",
    getMyMaintenanceRequests,
);

router.post(
    "/",

    createMaintenanceRequest,
);

router.get(
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    getMaintenanceRequests,
);

router.patch(
    "/:id/status",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    updateMaintenanceStatus,
);


export default router;