import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/mesaageRoutes.js";
import {Server} from "socket.io";

//create express app and http server
const app = express();
const server = http.createServer(app)

//initialise socket.io server
export const io= new Server(server,{
    cors:{origin:"*"}
})

//Store online users
export const userSocketMap = {};  //{userId:socketId}


//socket.io connectio handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected",userId);

    if(userId) userSocketMap[userId] = socket.id ;

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnected",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })

})


//middleware app
app.use(express.json({limit:"4mb"}));
app.use(cors());


//routes setup
app.use("/api/status",(req,res)=>res.send("server is ive"));
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);



//coonect to mongodb
await connectDB();


if(process.env.NODE_ENV !== "production"){
    const PORT = process.env.PORT || 5000;
server.listen(PORT,()=> console.log("Server is running on PORT:" + PORT)
);
}


//export server for vercel 
export default server;