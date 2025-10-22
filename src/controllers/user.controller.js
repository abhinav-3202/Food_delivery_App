import {asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/Apierror.js'
import { User } from '../models/user.models.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessTokens();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false }) // this part is saving it in the db
    
        return { accessToken , refreshToken }
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens ")
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {fullName , userName , email , password } = req.body

    if(
        [fullName , userName , email , password].some(field =>field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[ {userName} , {email} ]
    })

    if(existedUser){
        throw new ApiError(409, " User with given email or username already exist ")
    }

    let coverImageLocalFilePath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.Length > 0){
        coverImageLocalFilePath = req.files.coverImage[0].path;
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalFilePath);

    const user = await User.create({
        fullName,
        coverImage : coverImage?.url || "",
        userName : userName.toLowerCase(),
        email,
        password ,
        address,
        phone_no,
        userType,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200 , createdUser ,"User registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res)=>{
    const {email,userName , password} = req.body

    if(!userName || !email ){
        throw new ApiError(400,"UserName or email is required")
    }
    
    const user = await User.findOne({
        $or:[ {userName} , {email} ]
    })

    if(!user){
        throw new ApiError(404 , "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Incorrect Password")
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // doubt -->> where we are saving the refreshTokens in User in database..
    const options = {
        httpOnly : true,
        secure : true 
    }
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken" , refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser
            },
            "User loggedIn Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id ,
        {
            $set:{
                refreshToken : undefined,
            }
        },
        {
            new : true,
        }
    )
    const options = {
        httpOnly: true,
        secure : true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 , {} , " User logged Out Successfully ")
    )
})