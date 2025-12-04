import mongoose from "mongoose";

//funcrion to connect to the mongodb databse
export const connectDB = async() =>{
    try{

        mongoose.connection.on('connected',()=>console.log('Databse connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    }
    catch(error){
        console.log(error);

    }
}