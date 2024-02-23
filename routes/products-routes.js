const express = require("express");
const { check } = require("express-validator");

const productsControllers = require("../controllers/products-controllers");
const saveProductImages = require("../middleware/save-product-images");

const router = express.Router();

router.get("/all", productsControllers.getAllProducts);
router.get("/:pid", productsControllers.getProductById);
router.post(
  "/",
  saveProductImages.array("images"),
  productsControllers.createProduct
);

module.exports = router;
