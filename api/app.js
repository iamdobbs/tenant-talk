const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRouter = require("./routes/user");
const reviewRouter = require("./routes/review");
const propertyRouter = require("./routes/property");
const propertiesRouter = require("./routes/properties");

const app = express();

let corsOptions = {
  origin: ["https://tenant-talk-backend.onrender.com"],
};

app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", authRouter);
app.use("/review", reviewRouter);
app.use("/property", propertyRouter);
app.use("/properties", propertiesRouter);

module.exports = app;
