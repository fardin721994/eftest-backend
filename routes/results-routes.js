const express = require("express");
const { check } = require("express-validator");
const resultsControllers = require("../controllers/results-controllers");
const router = express.Router();

router.get("/", resultsControllers.getAllResults);
router.get("/:rid", resultsControllers.getResultsById);
router.post(
  "/",
  [check("profile").not().isEmpty(), check("results").not().isEmpty()],
  resultsControllers.createResults
);

// router.delete("/:rid", resultsControllers.deleteResults);

module.exports = router;
