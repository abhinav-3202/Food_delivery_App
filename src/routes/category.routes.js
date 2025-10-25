import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { Category } from "../models/category.models.js";
import { verifyRestaurantOwner } from "../middlewares/restaurantOwner.middleware.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js"
import {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCat,
} from "../controllers/category.controller.js"

const router = Router();

router.route("/create-Category").post(verifyAdmin , createCategory)
router.route("/get-All-Category").get(verifyJWT , getAllCategory )
router.route("/update-Category").post(verifyRestaurantOwner , updateCategory )
router.route("/delete-Category").delete(verifyAdmin , deleteCat )

export default router;