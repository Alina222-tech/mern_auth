const express = require("express");
const mongoose = require("mongoose");
<<<<<<< HEAD
const dotenv = require("dotenv");
const cors = require("cors");
const fileupload = require("express-fileupload");
=======
const cors = require("cors");
const fileUpload = require("express-fileupload");
const routes = require("../routes/userrouter.js");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(fileUpload());
app.use("/api/user", routes);

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(process.env.MONGO_URL);
  return cached.conn;
}
>>>>>>> 0704877ede37fa1a7b3f464df768c51323951480

dotenv.config();

<<<<<<< HEAD
const app = express();
const routes = require("./routes/userrouter.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(fileupload());

app.use("/api/user", routes);

app.get("/",(req,res)=>{
  res.send("server is running.")
})
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Database connected"))
.catch(() => console.log("Database NOT connected"));


module.exports = app;
=======
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running.");
});

module.exports.handler = serverless(app);
>>>>>>> 0704877ede37fa1a7b3f464df768c51323951480
