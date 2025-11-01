import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import { Food } from "../models/food.models.js";
import { Restaurant } from "../models/restaurant.models.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const addFood = asyncHandler(async(req,res)=>{
    const {
        title,
        description,
        price,
        //foodTags,
        category,
        isAvailable,
        rating,
    } = req.body

    if(!title || !description || !price ){
        throw new ApiError(400,"All fields are required")
    }

    /*if (!mongoose.Types.ObjectId.isValid(restaurant)) {
        throw new ApiError(400, "Invalid restaurant ID");
    }*/
    
    const restDoc = await Restaurant.findOne({owner : req.user._id}); 

    if(!restDoc){
        throw new ApiError(404,"No Restaurant found for this user!!! ")
    }

    // if(req.user._id.toString() !== restDoc.owner._id.toString() ){
    //     throw new ApiError(403,"Only res owner are allowed to addFood to their restaurant ")
    // }


    let imageUrl = ""
    let imageLocalFilePath;

    if(req.files && Array.isArray(req.files.foodImage) && req.files.foodImage.length>0){
        imageLocalFilePath =  req.files.foodImage[0].path
    }

    const foodImage = await uploadOnCloudinary(imageLocalFilePath) 

    const newFood = await Food.create({
        title,
        description,
        price,
        foodImage :foodImage?.url || "",
        //foodTags,
        category,
        isAvailable,
        restaurant : restDoc._id,
        rating,
    })

    if(!newFood ){
        throw new ApiError(500,"Failed to create food item ")
    }

    await Restaurant.findByIdAndUpdate(restDoc._id , { $push:{ foods : newFood._id }})

    return res
    .status(200)
    .json(new ApiResponse(201,newFood,"Food Added SuccessFully"))

})

const getAllFood = asyncHandler(async(req,res)=>{
    const foods = await Food.find({});

    if(!foods || foods.length === 0 ){
        throw new ApiError(404,"No food item was found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, foods , "Here are all food items. "))
})

const getDesiredFood = asyncHandler(async(req,res)=>{
    const foodId = req.params?.id;

    if(!foodId){
        throw new ApiError(401,"Could not get the food Id")
    }

    if(!mongoose.Types.ObjectId.isValid(foodId)){
        throw new ApiError(400,"Invalid foodId format")
    }

    const desiredfood = await Food.findById(foodId)

    if(!desiredfood){
        throw new ApiError(401,"Could not get the desired food")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,desiredfood , "Here is your desired food")
    )
})

const getFoodByRestaurant = asyncHandler(async(req,res)=>{
    const restaurantId = req.params.id
    if(!restaurantId){
        throw new ApiError(400, " Could not get restaurant ")
    }

    if(!mongoose.Types.ObjectId.isValid(restaurantId)){
        throw new ApiError(400,"Invalid restaurantId format")
    }

    const foods = await Food.find({restaurant : restaurantId })

    if(foods.length === 0 ){
        throw new ApiError(404,"Cannot get food from the desired restaurant")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , foods , "These are foods from Your choosen restaurants")
    )
})

const updateFood = asyncHandler(async(req,res)=>{
    const foodId = req.params?.id

    if(!foodId){
        throw new ApiError(400,"Could not get FoodId")
    }

    if(!mongoose.Types.ObjectId.isValid(foodId)){
        throw new ApiError(400,"Invalid foodId format")
    }

    const food = await Food.findById(foodId)

    if(!food) {
        throw new ApiError(400,"Could not get food")
    }

    const updates = {};

    [
        "title",
        "description",
        "price",
        "category",
        "isAvailable",
        "rating",
    ].forEach((field)=>{
        if(req.body[field] !== undefined) updates[field] = req.body[field]
    }) 

    if(req.files?.foodImage?.[0]){
        updates.foodImage = `/temp/${req.files.foodImage[0].filename}`; // /public already from app.use(express.static("public")) so public automatically comes in url
    }

    const updateFoods = await Food.findByIdAndUpdate(
        foodId,
        updates,
        {
            new:true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateFoods , "Food detals updated successfully")
    )
})

const deleteFood = asyncHandler(async(req,res)=>{
    const foodId = req.params?.id

    if(!foodId){
        throw new ApiError(400,"Could not get FoodId")
    }

    if(!mongoose.Types.ObjectId.isValid(foodId)){
        throw new ApiError(400,"Invalid foodId format")
    }

    const food = await Food.findById(foodId)

    if(!food){
        throw new ApiError(400, "Food does not exist")
    }
    await Food.findByIdAndDelete(foodId)

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"food Item deleted")
    ) 
})

const placeOrder = asyncHandler(async(req,res)=>{
    const { cart } = req.body 

    if(!cart || !Array.isArray(cart) || cart.length === 0 ){
        throw new ApiError(400, "Cart is empty or invalid")
    }

    const foodIds = cart.map(item=>item.foodId)
 
    const foodItems = await Food.find({ _id : { $in : foodIds} })  //  $ in : “is in this array of values”  foodIds :Array of IDs you want to find

    const total = foodItems.reduce((sum,item)=>sum + (item.price || 0 ) , 0)

    const newOrder = await Order.create({
        foods : foodIds,
        payment : total,
        buyer : req.user._id,
        status : "ordered"
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200 , newOrder , " Order placed Successfully")
    )
})

const orderStatus = asyncHandler(async(req,res)=>{
    const orderId = req.params.id;

    if( !orderId || !mongoose.Types.ObjectId.isValid(orderId)){
        throw new ApiError(400,"Invalid foodId format")
    }

    const {status} = req.body

    const allowedStatuses = ["preparing", "onTheWay", "delivered"];
        if (!status || !allowedStatuses.includes(status)) {
            throw new ApiError(400, "Invalid status value");
        }

    const order = await Order.findByIdAndUpdate(
        orderId,
        {
            status,
        },
        {
            new : true
        }
    )

    if(!order){
        throw new ApiError(404,"Order Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200 , order , "Order Status Updated")
    )

})

export {
    addFood,
    getAllFood,
    getDesiredFood,
    getFoodByRestaurant,
    updateFood,
    deleteFood,
    placeOrder,
    orderStatus,
}