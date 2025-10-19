import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({path:'/.env'});
import { app } from "./app.js";

connectDB()
.then(()=>{
    app.on("error" ,(error)=>{
        console.log("Error :" , error);
        throw error;
    })
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`Server is running at : ${process.env.PORT}`);
        
    })
})
.catch((error)=>{
    console.log("MongoDB connection failed !! ",error);
    
})