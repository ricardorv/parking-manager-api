import express from "express";
import mongoose from "mongoose";


import { router as parkingRouter } from "./controller/Parking";
import { errorHandler } from "./middleware/ErrorHandler";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const mongoUrl = process.env.MONGO_URL ?? 'mongodb://root:root@localhost:27017';
const dbName = process.env.MONGO_DB_NAME ?? 'parking-db'


const app = express();

// Pre-middlewares
app.use(express.json());

// Routes
app.use('/parking', parkingRouter);

// Post-middlewares
app.use(errorHandler);


mongoose.connect(mongoUrl, {dbName}).then(() => {
  app.listen(port, host, () => {
    console.log(`listening at http://${host}:${port}`);
  });
}).catch((err) => {
  return console.log(err);
});
