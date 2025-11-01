import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js"
import foodRouter from "./routes/food.routes.js"
import categoryRouter from "./routes/category.routes.js"
import restaurantRouter from "./routes/restaurant.routes.js"
import { ApiResponse } from "./utils/ApiResponse.js";

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true // allows cookies,authorization headers to be sent in cross-origin requests
}))

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public")) // storing something temporarily at the server in public folder just now created 
app.use(cookieParser())
app.use("/api/v1/users" , userRouter)
app.use("/api/v1/foods" , foodRouter)
app.use("/api/v1/category" , categoryRouter)
app.use("/api/v1/restaurants" , restaurantRouter )
/*app.use((err,req,res,next)=>{
    console.error("Error:" ,err);
    const statusCode = err.statusCode||500;
    const message = err.message || "Internal Server Error"

    return res
    .status(statusCode)
    .json(new ApiResponse (statusCode , null  , "Internal Server Error"))
})*/


export {app}