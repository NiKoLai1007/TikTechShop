const Category = require('../models/category')
const cloudinary = require('cloudinary')
const APIFeatures = require("../utils/apiFeatures");

exports.getCategory = async (req, res, next) => {
    const category = await Category.find()
    res.status(201).json({
        success: true,
        category
    })
}

exports.newCategory = async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    let imageDataUri = images[i];
    try {
      const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
        folder: "categories",
        width: 150,
        crop: "scale",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  req.body.images = imagesLinks;

  const category = await Category.create(req.body);
  if (!category)
    return res.status(400).json({
      success: false,
      message: "Category not created",
    });

  res.status(201).json({
    success: true,
    category,
  });
  };

  exports.deleteCategory = async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // await product.remove();
    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  };
  
  exports.updateCategory = async (req, res, next) => {

    let category = await Category.findById(req.params.id);
    // console.log(req.body)
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images.flat();
    }
    if (images !== undefined) {
      for (let i = 0; i < category.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          category.images[i].public_id
        );
      }
    }
    let imagesLinks = [];
    if (req.body.images) {
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "categories",
        });
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }
    req.body.images = imagesLinks;
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindandModify: false,
    });
    return res.status(200).json({
      success: true,
      category,
    });
  };
  exports.listCategory = async (req, res, next) => {
    const categorys = await Category.find();
  
    res.status(200).json({
      success: true,
      categorys,
    });
  };
