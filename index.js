const express = require("express");
const app = express();
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const { connectDB } = require("./config/db");
const port = process.env.PORT;
const appUrl = process.env.APP_URL;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

//routes
app.use("/api/v1/user", userRoutes);

//listening to the given port
app.listen(port, () => {
  console.log("app is live on", appUrl);
  connectDB();
});
