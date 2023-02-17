const express = require("express");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 8888;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  return res.send("ok");
});
app.listen(port, () => console.log("port is running on port " + port));
