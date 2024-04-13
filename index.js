const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const resultsRoutes = require("./routes/results-routes");
const adminsRoutes = require("./routes/admins-routes");

const HttpError = require("./utils/http-error");

const app = express();
// let hashedPassword;
// bcrypt.hash("fardin72", 12).then((data) => console.log(data));

app.use(bodyParser.json());

// THE CODE BELOW ABOUT CORS MIGHT NOT BE NEEDED WITHOUT USING REACT-ROUTER-DOM, BUT WHEN USING REACT-ROUTER-DOM, WE NEED IT, OTHERWISE WE GET CORS ERROR IN THE BROWSER.
// REMEMBER IF YOU TRY TO ACCESS A ROUTE WHICH DOES NOT EXIST, AN ERROR ABOUT CORS POLLICY WILL BE DISPLAYED IN CHROME DEV TOOLS WHICH IS NOT CORRECT AND THE ACTUALL ERROR ABOUT ROUTE NOT BEING FOUND WILL BE DISPLAYED IN BACKEND APP CONSOLE, OKAY? THE ERROR IN CHROME DEV TOOLS IS STH LIKE THIS: "Access to XMLHttpRequest at 'http://localhost:5000/api/adminss/login' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status."

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

app.use("/api/results", resultsRoutes);
app.use("/api/admins", adminsRoutes);

app.all("*", (req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  next(error);
});
//THIS IS OUR ERROR HANDLING MIDDLEWARE (WHENEVER app.use() RECEIVES A FUNCTION WITH 4 ARGUMENTS (err,req,res,next) => {...} , EXPRESS KNOWS THAT IT IS AN ERROR HANDLING MIDDLE-WARE) 👇:
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
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
    // app.listen(5000, "0.0.0.0", () => console.log("connected to port 5000"));
    app.listen(process.env.PORT || 5000, () =>
      console.log("connected to port 5000")
    );
  })
  .catch((err) => {
    console.log("Mongo DB Error: \n", err);
  });
