require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser");

//Routes
const authRoute =  require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/api", (req, res) => {
    res.send("hello");
});

app.use("/api/auth", authRoute);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to DataBASE");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
    });
}).catch((err) => {
    console.log(error);
});

