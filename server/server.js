const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/user", require("./routes/user"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/dashboard/todos", require("./routes/dashboard/todos"));

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is starting on port`, process.env.APP_PORT);
});