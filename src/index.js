const connectDB = require("./db");
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(
  cors({
    origin: "https://app-frontend-nine.vercel.app", // Replace with your actual frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
const port = process.env.PORT || 5000;
connectDB();
let host = process.env.REACT_APP_API_HOST;
app.get("/", (req, res) => {
  res.json({ message: "API is up and running" });
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/Notes", require("./routes/Notes"));
app.listen(port, () => {
  console.log("Server is Listening at Port" + port);
});
