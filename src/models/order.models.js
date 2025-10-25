import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema(
    {
        foods:[
            {
                type:  Schema.Types.ObjectId,
                ref:"food"
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
            enum :[ "preparing " , "on the way" , "delivered"],
            default : "preparing"
        }
    },
    {
        timestamps:true,
    }
)

export const Order = mongoose.model('Order',orderSchema)