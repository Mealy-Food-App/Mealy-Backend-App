import express from "express";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";
import {router as userRouter} from "./src/router/user.route.js";
import { globalErrorHandler } from "./src/utils/errorHandler.js";
import jwt from 'jsonwebtoken'
import morgan from "morgan";

const app = express();

// Database connection
mongoose.connect(config.mongodb_connection_url).then(() => console.log("Database Connection Established")).catch((e) => console.log(e.message));
console.log(config.mongodb_connection_url)

// PORT configuration
const port = config.port || 8080;

// Middlewares
app.use(express.json());
app.use(morgan("tiny"))
// app.use(bodyParser.json());


// Routes 
app.use('/api/mealy/user', userRouter);

app.use(globalErrorHandler)

// Setting up the express server
app.listen(port, ()=>{
    console.log(`Server runnning on port ${port}...`)
  })