require('dotenv').config();
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

console.log(process.env);
console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);


const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connect : ${conn.connection.host}`);
    }
    catch(error){
        console.log(`Error : ${error.message}`);
        process.exit();
    }
};

module.exports = connectDB;