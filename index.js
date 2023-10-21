const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Port = process.env.PORT || 5000;

mongoose
  .connect(
    "mongodb+srv://rhssoft1:HN5LOaFcnyoy6yB8@cluster0.4rvjzct.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection error: ", error));

app.use(express.json());

const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.get("/", (req, res) => res.json("Your first REST API"));

app.listen(Port, "0.0.0.0", () => {
  console.log(`Server is running on port ${Port}`);
});
