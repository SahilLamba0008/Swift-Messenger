const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const {chats} = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
 
// CORS - Middle Ware
app.use(cors());


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);


// ------------------Deployment-----------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV==='production'){

    app.use(express.static(path.join(__dirname1,'/frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'))
    })
}else{
    
app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});
}

// ------------------Deployment-----------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// console.log(process.env.PORT);

const server = app.listen(PORT,console.log(`Server Started at port ${PORT}`));

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{ 
        origin: "http://localhost:3000",
    }
});

io.on("connection",(socket)=>{
    console.log("Connected Socket io");

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('User Joined Room : ' + room);
    });

    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        console.log(chat);

        if(!chat.users) return console.log('chats.users not defined');

        chat.users.forEach(user=>{
            if(user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        })
    });

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});