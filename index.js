const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const resultsRoutes = require("./routes/results-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// THE CODE BELOW ABOUT CORS MIGHT NOT BE NEEDED WITHOUT USING REACT-ROUTER-DOM, BUT WHEN USING REACT-ROUTER-DOM, WE NEED IT, OTHERWISE WE GET CORS ERROR IN THE BROWSER.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

//   FOR THE EXPRESS.JS TO SERVE STATIC FILES, PLEASE PAY ATTENTION TO THE FOLLOWING TIPS:
// 1) THE VIDEO OR SUBTITLE SRC MUST BE SOME THING LIKE THE STRING BELOW:
// <source src="http://localhost:5000/api/static-files/courses-data/A/section_1/A1.mp4" />
// 2) AS YOU SEE THE PART "/api" IS NEEDED AND THE "epress.static" METHOD SHOULD BE USED LIKE THIS:
// app.use("/api/static-files", express.static("static-files"));
// 3) THIS LINE OF CODE MUST BE PLACED AFTER THE ABOVE CODE ABOUT CORS.
app.use("/api/static-files", express.static("static-files"));

// app.use("/api/courses", coursesRoutes);
// app.use("/api/users", usersRoutes);
// app.use("/api/words", wordsRoutes);
// app.use("/api/products", productsRoutes);
app.use("/api/results", resultsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kzyi0we.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
mongoose.set("strictQuery", true);
mongoose
  // .connect("mongodb://0.0.0.0:27017/eftest")
  .connect(
    "mongodb+srv://fardin:fardin72@cluster0.ihsghhy.mongodb.net/eftest?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    // app.listen(process.env.PORT || 5000);
    // app.listen(5000);
    app.listen(5000, "0.0.0.0", () => console.log("connected to port 5000"));
  })
  .catch((err) => {
    console.log("Mongo DB Error: \n", err);
  });
