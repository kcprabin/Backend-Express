import mongoose from "mongoose"
import { DataBaseName } from "../constants.js";

const DataBase = async ()=>{
    try {
   
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DataBaseName}`)
      console.log(`/n Connected to mongo db ${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("ERROR IN CONNECTION ",error);
        process.exit(1)
        
    }
}

export default DataBase