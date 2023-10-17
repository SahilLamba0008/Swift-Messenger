const express = require("express");
const {protect} = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatControllers");

const router = express.Router();

// protect() - auth middleware
// Access a chat (POST request)
router.route('/').post(protect,accessChat);

// Fetch all chats (GET request)
router.route('/').get(protect,fetchChats);

// Create a group chat (POST request)
router.route('/group').post(protect,createGroupChat);

// Update a Group CRUD (PUT request)
router.route('/rename').put(protect,renameGroup);
router.route('/groupremove').put(protect,removeFromGroup);
router.route('/groupadd').put(protect,addToGroup);

module.exports = router;
