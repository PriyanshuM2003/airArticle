const mongoose = require("mongoose");

const mognoURI =
  "mongodb+srv://airArticle:airArticle@cluster0.gdzx5ip.mongodb.net/airArticle?retryWrites=true&w=majority";

const connectTOMongo = () => {
  mongoose.connect(mognoURI);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error: " + err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });
};

module.exports = connectTOMongo;
