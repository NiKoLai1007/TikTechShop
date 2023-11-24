const Category = require('../models/category')
const cloudinary = require('cloudinary')

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
        folder: "products",
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
  
  
  
