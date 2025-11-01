import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema(
    {
        foods:[
            {
                type:  Schema.Types.ObjectId,
                ref:"Food"
            }
        ],
        payment:{
            type: Number , 
            required:true,
        },
        buyer:{
            type : Schema.Types.ObjectId,
            ref:"User"
        },
        status:{
            type:String,
            enum :[ "ordered" , "onTheWay" , "delivered"],
            default : "ordered"
        }
    },
    {
        timestamps:true,
    }
)

export const Order = mongoose.model('Order',orderSchema)