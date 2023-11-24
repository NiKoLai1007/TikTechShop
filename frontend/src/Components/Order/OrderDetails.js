import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import MetaData from '../Layout/Metadata'
import Loader from '../Layout/Loader'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

import { getToken } from '../../utils/helpers'


const OrderDetails = () => {

    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [order, setOrder] = useState({})
    

    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    let { id } = useParams();

    const downloadPDF = () => {
        const capture = document.querySelector('.col-12.col-lg-8.mt-5.order-details');
    
        html2canvas(capture).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save('Receipt.pdf');
        });
    };
    

    const getOrderDetails = async (id) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4001/api/v1/order/${id}`, config)
            setOrder(data.order)
            setLoading(false)


        } catch (error) {
            setError(error.response.data.message)
        }
    }

    useEffect(() => {
        getOrderDetails(id)

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        }
    }, [error, id])

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false


    
    return (
        <Fragment>
            <MetaData title={'Order Details'} />

            {loading ? <Loader /> : (
                <Fragment>
                
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8 mt-5 order-details">
                        <h1 className="mb-4">TikTech.shop</h1>
                        <h2 className="mb-4">Shipping Info</h2>
                        <h3 className="my-5">Order # {order._id}</h3>
                        <h5 className="mb-4">Receiver</h5>
                        
                            <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>Name:</th>
                                    <th>Phone:</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td>{user && user.name}</td>
                                <td>{shippingInfo && shippingInfo.phoneNo}</td>
                            </tbody>
                            <br />
                            <thead>
                                <tr>
                                    <th>Address:</th>
                                    <th>Amount:</th>
                                </tr>
                            </thead>
                           
                            <tbody>
                                <td>{shippingDetails}</td>
                                <td>${totalPrice}</td>
                            </tbody>

                            <br/>

                            <thead>
                                <tr>
                                    <th>Payment:</th>
                                    <th>Status:</th>
                                </tr>
                                </thead>
                                <tbody>
                                <td> <p className={isPaid ? "greenColor" : "redColor"}><b>{isPaid ? "PAID" : "NOT PAID"}</b></p></td>
                                <td><p className={order.orderStatus && String(order.orderStatus).includes('Delivered') ? "greenColor" : "redColor"} ><b>{orderStatus}</b></p></td>
                            </tbody>

             
                                

                            </table>
                           
                            <hr />
                            <h4 className="my-4">Order Items:</h4>
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(item => (
                                    <div key={item.product} className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={item.image} alt={item.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to={`/products/${item.product}`}>{item.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>${item.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{item.quantity} Piece(s)</p>
                                        </div>
                                        
                                       
                                    </div>
                                    
                                ))}
                                <div>
                                <button className="btn btn-success" onClick={downloadPDF}>
                                    Download PDF
                                </button>
                                </div>
                            </div>
                            <hr />
                        </div>
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default OrderDetails