import { Router } from "express";
import { Food } from "../models/food.models.js"
import { verifyRestaurantOwner } from "../middlewares/restaurantOwner.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
    addFood,
    getAllFood,
    getDesiredFood,
    getFoodByRestaurant,
    updateFood,
    deleteFood,
    placeOrder,
    orderStatus,
} from "../controllers/food.controller.js"

const router = Router();

router.route("/add-Food").post(verifyRestaurantOwner , addFood)
router.route("/get_all_food").get(verifyJWT , getAllFood)
router.route("/get_desired_food").get(verifyJWT,getDesiredFood)
router.route("/get_food_by_restaurant").get(verifyJWT,getFoodByRestaurant)
router.route("/update_food").post(verifyRestaurantOwner , updateFood)
router.route("/deletefood").delete(verifyRestaurantOwner, deleteFood)
router.route("/place_order").post(verifyJWT, placeOrder)
router.route("/order_status").post(verifyRestaurantOwner,orderStatus)