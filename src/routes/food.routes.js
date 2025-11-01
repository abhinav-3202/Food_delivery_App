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
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/add-Food")
    .post(
        verifyJWT ,
        verifyRestaurantOwner ,
        upload.fields([{name:"foodImage" , maxCount : 1}]),
        addFood 
    )
router.route("/get_all_food").get(verifyJWT , getAllFood)
router.route("/get_desired_food/:id").get(verifyJWT,getDesiredFood)
router.route("/get_food_by_restaurant/:id").get(verifyJWT,getFoodByRestaurant)
router.route("/update_food/:id").patch(verifyJWT , verifyRestaurantOwner ,upload.fields([{name:"foodImage" , maxCount : 1}]), updateFood)
router.route("/deletefood/:id").delete(verifyJWT ,verifyRestaurantOwner, deleteFood)
router.route("/place_order").post(verifyJWT, placeOrder) 
router.route("/order_status/:id").patch(verifyJWT ,verifyRestaurantOwner,orderStatus)

export default router;