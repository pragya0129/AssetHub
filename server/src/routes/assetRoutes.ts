import { Router } from "express";

import {
    createAsset,
    getAssets,
    getAssetById,
    updateAssetStatus,
} from "../controllers/assetController.js";

import {
    protect,
    authorize,
} from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get(
    "/",
    getAssets,
);

router.get(
    "/:id",
    getAssetById,
);

router.post(
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    createAsset,
);

router.patch(
    "/:id/status",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    updateAssetStatus,
);


export default router;