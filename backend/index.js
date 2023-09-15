const connectTOMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectTOMongo();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/articles", require("./routes/articles"));

app.listen(port, () => {
  console.log(`airArticle backend listening at http://localhost:${port}`);
});
