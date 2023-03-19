const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleware");

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes Middlesware
app.use("/api/users", userRoute);

// Routes
app.get("/", (req,res) => {
    res.send("Home Page");
})

//Error Middleware
app.use(errorHandler);


// Connection à la BDD et démarrage du serveur
const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`)
        })
    })    
    .catch((err) => console.log(err))