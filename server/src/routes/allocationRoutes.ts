import {
    Router,
} from "express";

import {
    allocateAsset,
    getAllocations,
    getMyAssets,
    returnAsset,
} from "../controllers/allocationController.js";

import {
    protect,
    authorize,
} from "../middleware/authMiddleware.js";


const router = Router();


router.use(
    protect,
);

router.get(
    "/my-assets",
    getMyAssets,
);

router.get(
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    getAllocations,
);


router.post(
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    allocateAsset,
);

router.patch(
    "/:id/return",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    returnAsset,
);


export default router;