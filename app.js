import express from "express";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";

const app = express();

// Database connection
mongoose.connect(config.mongodb_connection_url).then(() => console.log("Database Connection Established")).catch((e) => console.log(e.message));

// PORT configuration
const port = config.port || 5000;

app.use((err, req, res, next)=>{
    return res.status(err.status || 404).json({
      message: err.message,
      status: "Failed",
    })
  })

app.get('/', (req, res) => {
  res.status(200)
  .json({ message: 'hello from this side', app: 'mealy'});
});

// Middlewares
app.use(express.json())

// Routes 
// app.use('/api/v1/users', userRouter);

// Setting up the express server
app.listen(port, ()=>{
    console.log(`Server runnning on port ${port}...`)
  })