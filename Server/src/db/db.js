import mongoose from "mongoose"
import "dotenv/config"
console.log(process.env.MONGODB_URI)

const connectDB = async () => {
    console.log("Iam here")
    try {
          console.log("not this");
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/DartVision`,{
      
        })
        
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

export default connectDB