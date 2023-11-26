import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

import MetaData from '../Layout/Metadata'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import { getToken } from '../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserSalesChart from './UserSalesChart';
import MonthlySalesChart from './MonthlySalesChart';
import ProductSalesChart from './ProductSalesChart';

  
const Dashboard = () => {

    const [products, setProducts] = useState([])
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalAmount, setTotalAmount] = useState([])
    let outOfStock = 0;
    products.forEach(product => {
        if (product.stock === 0) {
            outOfStock += 1;
        }
    })
    const getAdminProducts = async () => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/products`, config)
            console.log(data)
            setProducts(data.products)
            setLoading(false)
        } catch (error) {
            setError(error.response.data.message)
           
        }
    }

    useEffect(() => {
        getAdminProducts()
        // allOrders()
        // allUsers()
    }, [])

    return (
        <Fragment>
            <div className="row">
                
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    

                    {loading ? <Loader /> : (
                        <Fragment>
                            <MetaData title={'Admin Dashboard'} />
                        
                           
                                        <div className="card-body">
                                        <h1 className="my-5">Dashboard</h1>
                                        </div>
                                   
                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Products<br /> <b>{products && products.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Orders<br /> <b>{orders && orders.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Users<br /> <b>{users && users.length}</b></div>
                                        </div>

                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        {/*<div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>0</b></div>
                                        </div>*/}

                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row pr-5">

                            <div className="col-xl-8 col-md-5 mb-2">
                                <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <MonthlySalesChart />
                                </div>
                                </div>
                            </div>
                            
                            <div className="col-xl-4 col-md-6 mb-2">
                                <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <UserSalesChart />
                                </div>
                                </div>
                            </div>

                            

                            <div className="col-xl-5 col-md-5 mb-1">
                                <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <ProductSalesChart />
                                </div>
                                </div>
                            </div>
                            </div>

                        </Fragment>
                    )}
                </div>
            </div>
        </Fragment >
    )
}

export default Dashboard