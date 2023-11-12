const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Port = process.env.PORT || 5000;

mongoose.connect("mongodb+srv://rhssoft1:HN5LOaFcnyoy6yB8@cluster0.4rvjzct.mongodb.net/?retryWrites=true&w=majority")
const connection = mongoose.connection;
connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(express.json());

const userRoute = require("./routes/user");
const ngoRoute = require("./routes/ngo");
const complaintRoute = require("./routes/complaint");
const contactRoute = require("./routes/contact")
const feedbackRoute = require("./routes/feedback")
app.use("/user", userRoute);
app.use("/ngo", ngoRoute);
app.use("/form", complaintRoute);
app.use("/contact", contactRoute);
app.use("/support",feedbackRoute);

app.get("/", (req, res) => res.json("Your first REST API"));

app.listen(Port, "0.0.0.0", () => {
  console.log(`Server is running on port ${Port}`);
});
