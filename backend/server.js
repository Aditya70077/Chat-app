const express= require('express');
const connectDB = require("./config/db");
const dotenv= require('dotenv');
const {chats}=require("./data/data");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path=require('path')
dotenv.config();
connectDB();
const app=express();


app.use(express.json());

app.get('/',(req,res)=>{
    res.send("API is running succesfully")
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/message", messageRoutes);
//----------------- development------------
const __dirname1 = path.resolve();
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}
else{
   app.get("/",(req,res)=>{
    res.send("API is running successfully");
   }) 
}
//----------------- development------------

app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000
const server = app.listen(5000,console.log(`Server has started on PORT ${PORT}`));

const io = require("socket.io")(server, {
    pingTimeout: 6000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io")
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    });
    socket.on('join chat',(room)=>{
       socket.join(room);
       console.log("user joined : "+room);
    });
    socket.on('typing',(room)=>socket.in(room).emit("typing"));
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"));
    socket.on("new message",(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat;
        if(!chat.users) return console.log('chat.users not defined');
        chat.users.forEach(user=>{
            if(user._id==newMessageRecieved.sender._id) return ;
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })
    });
    socket.off('setup',()=>{
        console.log("user disconnected");
        socket.leave(userData._id);
    });
});