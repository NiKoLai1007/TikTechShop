const Product = require('../models/product')
const Order = require('../models/order')
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')

// exports.newProduct = async (req, res, next) => {
	
// 	req.body.user = req.user.id;
// 	const product = await Product.create(req.body);
// 	res.status(201).json({
// 		success: true,
// 		product
// 	})
// }

// exports.getProducts = async (req, res, next) => {
// 	const products = await Product.find({});
// 	res.status(200).json({
// 		success: true,
// 		count: products.length,
// 		products
// 	})
// }

http://localhost:4001/api/v1/products?keyword=apple&page=2
exports.getProducts = async (req,res,next) => {
	
	const resPerPage = 4;
	const productsCount = await Product.countDocuments();
	const apiFeatures = new APIFeatures(Product.find(),req.query).search().filter(); 

	// const products = await Product.find();
	apiFeatures.pagination(resPerPage);
	const products = await apiFeatures.query;
	let filteredProductsCount = products.length;
	res.status(200).json({
		success: true,
		filteredProductsCount,
		productsCount,
		products,
		resPerPage,
	})
}

exports.getSingleProduct = async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}
	res.status(200).json({
		success: true,
		product
	})
}

// exports.updateProduct = async (req, res, next) => {
// 	let product = await Product.findById(req.params.id);
// 	console.log(req.body)
// 	if (!product) {
// 		return res.status(404).json({
// 			success: false,
// 			message: 'Product not found'
// 		})
// 	}
// 	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
// 		new: true,
// 	})
// 	if (!product) {
// 		return res.status(404).json({
// 			success: false,
// 			message: 'Product not updated'
// 		})
// 	}
// 	res.status(200).json({
// 		success: true,
// 		product
// 	})
// }

exports.deleteProduct = async (req, res, next) => {
	const product = await Product.findByIdAndDelete(req.params.id);
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}
	// await product.remove();
	res.status(200).json({
		success: true,
		message: 'Product deleted'
	})
}

exports.getAdminProducts = async (req, res, next) => {

	const products = await Product.find();

	res.status(200).json({
		success: true,
		products
	})

}

exports.newProduct = async (req, res, next) => {

	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}

	let imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		let imageDataUri = images[i]
		// console.log(imageDataUri)
		try {
			const result = await cloudinary.v2.uploader.upload(`${imageDataUri}`, {
				folder: 'products',
				width: 150,
				crop: "scale",
			});
	
			 imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})
			
		} catch (error) {
			console.log(error)
		}
		
	}

	req.body.images = imagesLinks
	req.body.user = req.user.id;

	const product = await Product.create(req.body);
	if (!product)
		return res.status(400).json({
			success: false,
			message: 'Product not created'
		})


	res.status(201).json({
		success: true,
		product
	})
}

exports.updateProduct = async (req, res, next) => {
	let product = await Product.findById(req.params.id);
	// console.log(req.body)
	if (!product) {
		return res.status(404).json({
			success: false,
			message: 'Product not found'
		})
	}
	let images = []

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
	if (images !== undefined) {
        // Deleting images associated with the product
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
	}
	let imagesLinks = [];
	for (let i = 0; i < images.length; i++) {
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: 'products'
		});
		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		})

	}
	req.body.images = imagesLinks
	product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
		useFindandModify: false
	})
	// console.log(product)
	return res.status(200).json({
		success: true,
		product
	})
}

exports.createProductReview = async (req, res, next) => {
	const { rating, comment, productId } = req.body;
	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment
	}
	const product = await Product.findById(productId);
	const isReviewed = product.reviews.find(
		r => r.user && (r.user.toString() === req.user._id.toString())
	)
	if (isReviewed) {
		product.reviews.forEach(review => {
			console.log(review)
			if (review.user && (review.user.toString() === req.user._id.toString())) {
				review.comment = comment;
				review.rating = rating;
			}
		})
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length
	}
	product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
	await product.save({ validateBeforeSave: false });
	if (!product)
		return res.status(400).json({
			success: false,
			message: 'review not posted'
		})
	return res.status(200).json({
		success: true
	})
}

exports.getProductReviews = async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}
exports.deleteReview = async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(review => review && (review._id.toString() !== req.query.id.toString()));
    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({
        success: true
    })
}

exports.productSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }

            },
            
        },
    ])
    console.log(totalSales)
    const sales = await Order.aggregate([
        { $project: { _id: 0, "orderItems": 1, totalPrice: 1 } },
         { $unwind: "$orderItems" },
        {
            $group: {
                _id: { product: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ])
	console.log("sales", sales)
    
    if (!totalSales) {
		return res.status(404).json({
			message: 'error sales'
		})
       
    }
    if (!sales) {
		return res.status(404).json({
			message: 'error sales'
		})
      
    }
    
    let totalPercentage = {}
    totalPercentage = sales.map(item => {
         
        // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
        percent = Number (((item.total/totalSales[0].total) * 100).toFixed(2))
        total =  {
            name: item._id.product,
            percent
        }
        return total
    }) 
    // return console.log(totalPercentage)
    res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })

}