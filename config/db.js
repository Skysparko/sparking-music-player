const { Sequelize } = require("sequelize");

//creating database and giving it (name,user,password,{options})
const createDB = new Sequelize("Sparking-db", "skysparko", "yesiamsparko", {
  dialect: "sqlite",
  host: "./config/db.sqlite",
});

//checking connection for db
const connectDB = () => {
  createDB
    .sync()
    .then(() => {
      console.log("Db is connected");
    })
    .catch((e) => {
      console.log("Db is not connected\n<<<<<<<<", e);
    });
};

module.exports = { createDB, connectDB };
