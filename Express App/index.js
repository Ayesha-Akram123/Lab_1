const express = require("express");
let app = express();

app.use(express.static("public"));

app.set("view engine" , "ejs");

app.get("/resume" , (req , res) => {
    res.render("resume");
})

app.get("/" , (req , res) => {
    res.render("home");
})

app.listen(5000 , () => {
    console.log("Server started at Port : 5000");
})