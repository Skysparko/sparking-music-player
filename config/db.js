const mongoose = require("mongoose");

const dbUrl =
  "mongodb+srv://skysparko:uLpbTRQ0dPTNao67@sparking-music.5mxqyae.mongodb.net/sparking-db?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.set("strictQuery", false);

const connectDB = () => {
  mongoose
    .connect(dbUrl, connectionParams)
    .then(() => {
      console.log("DB is connected");
    })
    .catch((e) => {
      console.log("DB is not connected");
      console.log("<<<<<<<<", e);
    });
};

module.exports = connectDB;
