import dotenev from "dotenv"
import connectDB from "./db/db.js"
dotenev.config({
   path:'./env'
})
connectDB()
.then(()=>{
   app.listen(process.env.PORT||5000,()=>{
      console.log(`Server is runn at port :${process.env.PORT}`)
   })
})
.catch((err)=>{
   console.log("Mongodb connection failed !!",err)
})