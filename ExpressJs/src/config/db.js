import mongoose from 'mongoose'

const connectDB = async ()=>{
  try{
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ MONGODB CONNECTED SUCCESSFULLY !!")
  }catch(error){
    console.log("❌ Database connection failed", error)
    process.exit(1)
  }
}

export default connectDB