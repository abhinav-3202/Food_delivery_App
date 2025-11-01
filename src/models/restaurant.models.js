import mongoose,{Schema} from "mongoose";

const restaurantSchema = new Schema(
    {
        Res_Name :{
            type:String,
            required:[true,"Restaurant Name is required"],
            trim:true,
            index:true,
        },
        imgUrl:{
            type:String,
        },
        foods:{
            type:Array
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        // time:{
        //     type:String,
        // },
        pickUp:{
            type:Boolean,
            default:true,
        },
        delivery:{
            type:Boolean,
            default:true,
        },
        isOpen:{
            type:Boolean,
            default:true,
        },
        logoUrl:{
            type:String,
        },
        rating:{
            type:Number,
            default:1,
            min:1,
            max:5,
        },
        // ratingCount:{
        //     type:String,
        // },
        // code:{
        //     type:String
        // },
        coords:{
            id: { type: String },
            latitude: { type: Number },
            latitudeDelta: { type: Number },
            longitude: { type: Number },
            longitudeDelta: { type: Number },
            address: { type: String },
            title: { type: String },
        }
    },
    {
        timestamps:true
    }
)

export const Restaurant = mongoose.model('Restaurant',restaurantSchema)