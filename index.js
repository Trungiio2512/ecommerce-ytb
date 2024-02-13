const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/connect");
const initRoutes = require("./routes");
const cors = require("cors");
const corsOptions = require("./config/cors");

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser.json());

dbConnect();
initRoutes(app);
app.listen(process.env.PORT, () => console.log("port is running on port " + port));
