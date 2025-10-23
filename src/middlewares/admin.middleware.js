import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

export const verifyAdmin = asyncHandler(async(req,res,next)=>{
    const user = req?.user
    
    if(!user){
        throw new ApiError(401, "Unauthorized user , no user found in request")
    }

    if(user.userType !== "admin"){
        throw new ApiError(401,"You are not allowed to access")
    }
    next();    
})