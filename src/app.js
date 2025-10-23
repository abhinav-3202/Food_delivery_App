import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js"

const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true // allows cookies,authorization headers to be sent in cross-origin requests
}))

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public ")) // storing something temporarily at the server in public folder just now created 
app.use(cookieParser())
app.use("/api/v1/users" , userRouter)


export {app}