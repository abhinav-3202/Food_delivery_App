import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/Apierror.js";

export const verifyRestaurantOwner = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "Unauthorized user , no user found in request")
    }
    
    if (user.userType !== "restaurant") {
        throw new ApiError(403, "Only restaurant owners can update their food items");
    }
    next();
});