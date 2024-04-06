const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

dotenv.config();

//connecting app with mongodb
const client = new MongoClient(process.env.MONGO_URL);
// console.log(client);

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("Successfully connected to MongoDB");
});
// async function run() {
//   try {
//     await client.connect();
//     console.log("Successfully connected to MongoDB");
//   } catch (error) {
//     console.log(error);
//   }
// }
// run().catch(console.dir);

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
//created a server which runs on port no. 8800
app.listen(8800, () => {
  console.log("Backend Server is running!!!-_-");
});
