const express = require("express");
const { formatDate } = require("@adminsync/utils");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  console.log("Formated Date",formatDate(new Date()));
});