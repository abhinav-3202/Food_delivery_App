import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Restaurant } from "../models/restaurant.models.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const addRestaurant = asyncHandler(async(req,res)=>{
    const {
        Res_Name,
        imgUrl,
        pickUp,
        delivery,
        isOpen,
        logoUrl,
        rating,
        coords,
    } = req.body

    if(!Res_Name || !coords){
        throw new ApiError(400, " Please provide Res_name and address")
    }

    const newRestaurant = await Restaurant.create({
        Res_Name,
        imgUrl,
        pickUp,
        delivery,
        isOpen,
        logoUrl,
        rating,
        owner : req.user._id,
        coords,
        foods : [],
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,newRestaurant,"Restaurant Added SuccessFully")
    )
})

const getAllRestaurant = asyncHandler(async(req,res)=>{
    const restaurants = await Restaurant.find({});

    if( ! restaurants || restaurants.length === 0 ){
        throw new ApiError(400, "Cannot get All restaurants")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,restaurants,"Here is All list of all restaurants")
    )
})

const getResturantById = asyncHandler(async(req,res)=>{
    const restaurantId = req.params?.id

    if(!restaurantId){
        throw new ApiError(400,"Cannot get RestaurantId")
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        throw new ApiError(400, "Invalid restaurant ID format");
    }

    const restaurant = await Restaurant.findById(restaurantId)

    if(!restaurant){
        throw new ApiError(400,"Cannot get the desired restaurant")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,restaurant,"Here is your desired Restaurant")
    )
})

const deleteResturant = asyncHandler(async(req,res)=>{
    const restaurantId = req.params.id

    if(!restaurantId){
        throw new ApiError(400,"Cannot get RestaurantId")
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        throw new ApiError(400, "Invalid restaurant ID format");
    }

    const restaurant = await Restaurant.findById(restaurantId)

    if(restaurant.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You are not Authorized to delete this restaurant")
    }
    
    const deletedRestaurnat = await Restaurant.findByIdAndDelete(restaurantId)

    if(!deletedRestaurnat){
        throw new ApiError(404 , "Restaurant not found or already deleted")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {} , "Restaurant was deleted")
    )
})

export {
    addRestaurant,
    getAllRestaurant,
    getResturantById,
    deleteResturant,
}