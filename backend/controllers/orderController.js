const Order = require('../models/order');
const Product = require('../models/product');
const nodemailer = require('nodemailer');
const User = require('../models/user');


const PDFDocument = require('pdfkit');

exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })
    sendEmailToAdmin(order);

    res.status(200).json({
        success: true,
        order
    })    

}

async function generateOrderPDF(order) {
    return new Promise(async (resolve, reject) => {
        const doc = new PDFDocument();

        doc.fontSize(18).text('TikTech Shop Order Receipt', { align: 'center' });
        doc.fontSize(12).text('1630, Taguig City, Metro Manila, Philippines', { align: 'center' });
        doc.moveDown();

        doc.fontSize(15).text('------------------------------------------------------------------', { align: 'center' });
        doc.fontSize(15).text('RECEIPT', { align: 'center' });
        doc.fontSize(15).text('------------------------------------------------------------------', { align: 'center' });


        doc.fontSize(14).text('Ordered Products:', { align: 'center' });
        order.orderItems.forEach(item => {
            const productText = ` ${item.name} (₱${item.price.toFixed(2)} each) x ${item.quantity}`;
            doc.text(productText, { align: 'center' });
        });
        doc.moveDown();

        doc.fontSize(12).text(`Order ID:`, { align: 'left' });
        doc.text(`${order._id}`, { align: 'right' });

        doc.text(`Order Date:`, { align: 'left' });
        doc.text(`${order.createdAt}`, { align: 'right' });

        doc.text(`Delivery Date:`, { align: 'left' });
        doc.text(`${new Date(order.deliveredAt).toLocaleDateString()}`, { align: 'right' });

        doc.text(`Order Total:`, { align: 'left' });
        doc.text(`₱${order.totalPrice.toFixed(2)}`, { align: 'right' });

        doc.moveDown();

        doc.fontSize(15).text('----------------------------------------------------', { align: 'center' });
        doc.fontSize(14).text('Customer Information:', { align: 'center' });
    
            const user = await User.findById(order.user);
            
                doc.fontSize(12).text(`Name:`, { align: 'left' });
                doc.text(`${user.name}`, { align: 'right' });

                doc.text(`Email:`, { align: 'left' });
                doc.text(`${user.email}`, { align: 'right' });
    

        const addressText = `Address: ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.postalCode}, ${order.shippingInfo.country}`;
        doc.text(addressText, { align: 'center' });
        doc.fontSize(15).text('----------------------------------------------------', { align: 'center' });
        doc.moveDown();

        doc.fontSize(16).text('Thank you.', { align: 'center' });


        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer.toString('base64'));
        });

        doc.end();
    });
}



function sendEmailToAdmin(order) {
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'acd56bdea70288',
            pass: 'fe5d00b3474c67'
        }
    });

    const mailOptions = {
        from: order.user.email,
        to: 'shan.palima@tup.edu.ph',
        subject: 'New Order from Customer',
        text: `A new order with ID ${order._id} has been placed. You can now proceed updating the order status.`,

    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })

    }

    res.status(200).json({
        success: true,
        order
    })
}

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
}

exports.allOrders = async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}

exports.updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: `No Order found with this ID` });
        }

        if (order.orderStatus === 'Delivered') {
            return res.status(400).json({ message: `This order has already been delivered` });
        }

        order.orderItems.forEach(async item => {
            await updateStock(item.product, item.quantity);
        });

        order.orderStatus = req.body.status;
        order.deliveredAt = Date.now();
        await order.save();

        if (order.orderStatus === 'Delivered') {
            sendEmailToCustomer(order);
        }

        //sendEmailToAdmin(order);

        res.status(200).json({
            success: true,
            message:` Order delivered. The customer will take the order.`
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({
            success: false,
            message: `Failed to update order. ${error.message || 'Unknown error'}`
        });
    }
};

async function sendEmailToCustomer(order) {

  

    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: '92ed92aceed9c6',
            pass: '8513d25570742e',
        },
    });
    const pdfContent = await generateOrderPDF(order);

    const mailOptions = {
        from: 'shan.palima@tup.edu.ph',
        to: 'shanpalima10@gmail.com',
        subject: 'Your Order has been Delivered',
        text: `Your order with ID ${order._id} has been delivered. Please prepare for the exact amount of ₱${order.totalPrice.toFixed(2)}. Enjoy!,`,
        attachments: [
            {
                filename: 'receipt.pdf',
                content: pdfContent,
                encoding: 'base64',
            },
        ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}
// exports.updateOrder = async (req, res, next) => {
//     const order = await Order.findById(req.params.id)

//     if (order.orderStatus === 'Delivered') {
//         return res.status(404).json({ message: `You have already delivered this order` })

//     }

//     order.orderItems.forEach(async item => {
//         await updateStock(item.product, item.quantity)
//     })

//     order.orderStatus = req.body.status
//     order.deliveredAt = Date.now()
//     await order.save()

//     res.status(200).json({
//         success: true,
//     })
// }

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })
     
    }
    await order.remove()

    res.status(200).json({
        success: true
    })
}

exports.totalOrders = async (req, res, next) => {
    const totalOrders = await Order.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    if (!totalOrders) {
        return res.status(404).json({
            message: 'error total orders',
        })
    }
    res.status(200).json({
        success: true,
        totalOrders
    })

}

exports.totalSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" }
            }
        }
    ])
    if (!totalSales) {
        return res.status(404).json({
            message: 'error total sales',
        })
    }
    res.status(200).json({
        success: true,
        totalSales
    })
}

exports.customerSales = async (req, res, next) => {
    const customerSales = await Order.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            },
        },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //     }
        // },

        { $unwind: "$userDetails" },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //         doc: { "$first": "$$ROOT" },

        //     }
        // },

        // {
        //     $replaceRoot: {
        //         newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
        //     },
        // },
        {
            $group: {
                _id: "$userDetails.name",
                total: { $sum: "$totalPrice" }
            }
        },
        // {
        //     $project: {
        //         _id: 0,
        //         "userDetails.name": 1,
        //         total: 1,
        //     }
        // },
        { $sort: { total: -1 } },

    ])
    console.log(customerSales)
    if (!customerSales) {
        return res.status(404).json({
            message: 'error customer sales',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        customerSales
    })

}
exports.salesPerMonth = async (req, res, next) => {
    const salesPerMonth = await Order.aggregate([
        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: {
                    year: { $year: "$paidAt" },
                    month: { $month: "$paidAt" }
                },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec']
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: 1,
                total: 1,
            }
        }

    ])
    if (!salesPerMonth) {
        return res.status(404).json({
            message: 'error sales per month',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })

}