import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description:{
    type:String,
    required: true,
  },
  thumbnail:{
    type: String,
    required: true
  },
  videoFile:{
    type: String,  //URL come from Cloudinary
    required: true
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  duration: {
    type: Number,  //Cloudinary send file detail with URL
    required: true
  },
  views:{
    type:Number,
    default:0,
    required: true
  },
  idPublished:{
    type: Boolean,
    default: false,
    required: true
  }

},{
  timestamps: true
})

videoSchema.plugin(mongooseAggregatePaginate);


export const Video = mongoose.model("Video", videoSchema)