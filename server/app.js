const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const AppError = require("./utils/appError");
const golbalErrorHandler = require("./controllers/errorController");
const cors = require("cors");
const { sendResetPasswordEmail } = require("./controllers/authController");

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", notesRoutes);
app.use("/api/v1/email", sendResetPasswordEmail);

app.all("*", (req, res, next) => {
  next(new AppError("Can't find this route", 404));
});

app.use(golbalErrorHandler);

module.exports = app;
