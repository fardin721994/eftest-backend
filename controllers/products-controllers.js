const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Product = require("../models/product");

const getAllProducts = async (req, res, next) => {
  let products;
  try {
    products = await Product.find();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not return the products.",
      500
    );
    return next(error);
  }

  if (!products) {
    const error = new HttpError("There's not any product to return.", 404);
    return next(error);
  }
  // const productsList = products.map((product) => ({
  //   id: product._id,
  //   profile: product.profile,
  // }));
  // res.status(200).json(productsList);
  res.status(200).json(products);
};

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { code, title, description, price, categories, stock, colors } =
    req.body;
  const images = req.files.map((file) => file.originalname);
  const createdProduct = new Product({
    code,
    title,
    description,
    price,
    categories,
    stock,
    colors,
    images,
  });

  //   let user;
  //   try {
  //     user = await User.findById(creator);
  //   } catch (err) {
  //     const error = new HttpError(
  //       "Creating product failed, please try again",
  //       500
  //     );
  //     return next(error);
  //   }

  //   if (!user) {
  //     const error = new HttpError("Could not find user for provided id", 404);
  //     return next(error);
  //   }

  //   console.log(user);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await createdCourse.save({ session: sess });
    // user.courses.push(createdCourse);
    // await user.save({ session: sess });
    // await sess.commitTransaction();
    await createdProduct.save();
  } catch (err) {
    const error = new HttpError(
      "Creating new product failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product.",
      500
    );
    return next(error);
  }

  product.title = title;
  product.description = description;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update product.",
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

// const deleteProduct = async (req, res, next) => {
//   const productId = req.params.pid;

//   let product;
//   try {
//     product = await Product.findById(productId).populate("creator");
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not delete product.",
//       500
//     );
//     return next(error);
//   }

//   if (!product) {
//     const error = new HttpError("Could not find product for this id.", 404);
//     return next(error);
//   }

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await product.remove({ session: sess });
//     product.creator.products.pull(product);
//     await product.creator.save({ session: sess });
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not delete product.",
//       500
//     );
//     return next(error);
//   }

//   res.status(200).json({ message: "Deleted product." });
// };

exports.getProductById = getProductById;
exports.getAllProducts = getAllProducts;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
// exports.deleteProduct = deleteProduct;
