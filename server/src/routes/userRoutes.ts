import {
    Router,
} from "express";


import {
    getUsers,
} from "../controllers/userController.js";


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
    "/",

    authorize(
        "ADMIN",
        "ASSET_MANAGER",
    ),

    getUsers,
);


export default router;