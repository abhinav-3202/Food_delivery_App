import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Category } from "../models/category.models.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createCategory = asyncHandler(async(req,res)=>{
    const {title , imageUrl } = req.body

    if(!title ||  ! imageUrl){
        throw new ApiError(400,"Both fields Are required")
    }

    const newCategory = await Category.create({
        title,
        imageUrl,
    })

    if(!newCategory){
        throw new ApiError(500, " Could not add new category ")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newCategory, " new category was added")
    )
})

const getAllCategory = asyncHandler(async(req,res)=>{
    const categories = await Category.find({});

    if(!categories || categories.length === 0 ){
        throw new ApiError(400,"Could not get All Categories")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,categories," Here is all categories of food")
    )
})

const updateCategory = asyncHandler(async(req,res)=>{
    const catId = req.params
    const { title , imageUrl } = req.body
    
    if(!catId || mongoose.Types.ObjectId.isValid(catId)){
        throw new ApiError(400 , "catId is required ")
    }

    const updates = {}
    [
        title,
        imageUrl
    ].forEach(field=>{
        if(req.body[field]) updates[field] = req.body[field]
    })

    const updateCat = await Category.findByIdAndUpdate(
        catId,
        updates,
        {
            new : true,
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,updateCat,"Category was updated")
    )
})

const deleteCat = asyncHandler(async(req,res)=>{
    const catId = req.params.id

    if(!catId || !mongoose.Types.ObjectId.isValid(catId)){
        throw new ApiError(400 , "catId is required ")
    }

    const deletedCat = await Category.findByIdAndDelete(catId)

    if(!deletedCat){
        throw new ApiError(404 , "Could not delete category")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Category was deleted")
    )
})

export {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCat,
}