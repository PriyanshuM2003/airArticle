const connectTOMongo = require("./db");
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");

dotenv.config();
connectTOMongo();

const corsOptions = {
  origin: process.env.HOST,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const app = express();
const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/articles", require("./routes/articles"));

app.listen(port, () => {
  console.log(`airArticle backend listening at port ${port}`);
});
