const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
const url_DB = process.env.MONGO_URL

const db =process.env.DB_NAME

const connectDB = async () => {
    try {
    await mongoose.connect(`${url_DB}/${db}`);
    console.log("mongoose is connect ✅");
  } catch (error) {
    console.log(error)
    console.log("connexion with data base is failed⚠️");
  }
};

module.exports=connectDB;