const { default: mongoose } = require("mongoose");
const monggose = require ("mongoose");
async function connectDB() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected To DB");
    } catch (error) {
        console.log("Error : " , error);
    }
}