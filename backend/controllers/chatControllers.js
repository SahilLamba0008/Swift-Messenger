const { useRadio } = require("@chakra-ui/react");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler( async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log('UserID params not sent with request');
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat:false,
        $and: [
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq: userId}}},
        ],
    }).populate("users","-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat,{
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if( isChat.length > 0 ){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id,userId],
        }

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat.id}).populate(
                "users",
                "-password"
            );

            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});


const fetchChats = asyncHandler( async(req,res)=>{
    try{
        Chat.find({users: {$elemMatch: { $eq: req.user._id }}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then( async(results)=>{
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select: "name pic email",
            });

            res.status(200).send(results);
        });
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {   // more then 2 users for Group Chat
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json({
        message: "Group chat created successfully",
        groupChat: fullGroupChat,
});
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});


const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        // Check if the user is already in the group
        const chat = await Chat.findById(chatId);
        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found");
        }

        if (chat.users.includes(userId)) {
            res.status(400).json({ message: "User is already in the group chat" });
        } else {
            // Add the user to the group
            const added = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: { users: userId },
                },
                {
                    new: true,
                }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");

            if (!added) {
                res.status(404);
                throw new Error("Chat Not Found");
            } else {
                res.json(added);
            }
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        next(error);
    }
});

module.exports = {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup};