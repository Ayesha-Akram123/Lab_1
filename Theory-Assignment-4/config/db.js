const mongoose = require("mongoose");
async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database Connected");

    }
    catch (error) {
        console.log("Error Connection To Database");
    }
}

module.exports = connectDB;