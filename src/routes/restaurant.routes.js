import { Router } from "express";
import { Restaurant } from "../models/restaurant.models.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { verifyRestaurantOwner } from "../middlewares/restaurantOwner.middleware.js";
import {
    addRestaurant,
    getAllRestaurant,
    getResturantById,
    deleteResturant,
} from "../controllers/restaurant.controller.js"

const router = Router();

router.route("/add_restaurant").post(verifyJWT, verifyRestaurantOwner , addRestaurant)
router.route("/get_all_restaurant").get(verifyJWT, getAllRestaurant)
router.route("/get_restaurant/:id").get(verifyJWT, getResturantById)
router.route("/delete_restaurant/:id").delete(verifyJWT , verifyRestaurantOwner , deleteResturant)

export default router;