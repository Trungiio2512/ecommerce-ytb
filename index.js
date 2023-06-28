const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/connect");
const initRoutes = require("./routes");
const cors = require("cors");
const port = process.env.PORT || 8888;

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.URL_CLIENT,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
// app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);
app.listen(port, () => console.log("port is running on port " + port));
