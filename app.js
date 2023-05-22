import express from "express";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";

const app = express();

// Database connection
mongoose.connect(config.mongodb_connection_url).then(() => console.log("Database Connection Established")).catch((e) => console.log(e.message));

// PORT
const port = config.port || 5000;

app.use((err, req, res, next)=>{
    return res.status(err.status || 404).json({
      message: err.message,
      status: "Failed",
    })
  })

// Setting up the express server
app.listen(port, ()=>{
    console.log(`Server runnning on port: ${port}`)
  })