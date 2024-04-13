const express = require("express");
const { check } = require("express-validator");
const resultsControllers = require("../controllers/results-controllers");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.post(
  "/",
  [check("profile").not().isEmpty(), check("results").not().isEmpty()],
  resultsControllers.createResults
);
// THESE ROUTES SHOULD BE PROTECTED 👇:
router.use(checkAuth);
router.get("/", resultsControllers.getAllResults);
router.get("/:rid", resultsControllers.getResultsById);
router.delete("/:rid", resultsControllers.deleteResults);

module.exports = router;
