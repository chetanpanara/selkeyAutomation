const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/auth-routes");
const folderRouter = require("./routes/user/folder-routes");
const userRouter = require("./routes/user/user-routes");
const workflowRouter = require("./routes/user/workflow-routes");

const AppIntegration = require("./routes/admin/app-routes");
const triggerRouter = require("./routes/admin/trigger-routes");
const actionRouter = require("./routes/admin/action-routes");
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Hello Developer</h1>");
});

app.use("/api/auth", authRouter);
app.use("/api/apps", AppIntegration);
app.use("/api/triggers", triggerRouter);
app.use("/api/actions", actionRouter);

app.use("/api/folders", folderRouter);
app.use("/api/user", userRouter);
app.use("/api/workflows", workflowRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
