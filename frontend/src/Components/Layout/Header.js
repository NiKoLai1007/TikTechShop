import React, { Fragment, useEffect, useState } from 'react'
import '../../App.css'
import Search from './Search'
import { Link, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaShoppingCart } from 'react-icons/fa'; 

const Header = ({ cartItems }) => {

    const [user, setUser] = useState('')
    const navigate = useNavigate()
    const logoutUser = async () => {

        try {
            await axios.get(`http://localhost:4001/api/v1/logout`)

            setUser('')

            logout(() => navigate('/'))
        } catch (error) {
            toast.error(error.response.data.message)

        }
    }
    const logoutHandler = () => {
        logoutUser();
        toast.success('log out', {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }
    useEffect(() => {
        setUser(getUser())
    }, [])
    return (
        <Fragment>
            <div className="container-fluidnav">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-right"> 
                    <a className="mr-2 text-white">Follow us on</a>
                    <a href="#" target="_blank" className="mr-2"><i className="fa fa-facebook"></i></a>
                    <a href="#" target="_blank" className="mr-2"><i className="fa fa-twitter"></i></a>
                    <a href="#" target="_blank" className="mr-2"><i className="fa fa-instagram"></i></a>

                    {user ? (<div className="ml-4 dropdown d-inline">
                        <Link to="#!" className="btn dropdown-toggle text-white mr-4" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <figure className="avatar avatar-nav">
                                <img
                                    src={user.avatar && user.avatar.url}
                                    alt={user && user.name}
                                    className="rounded-circle"
                                />
                            </figure>
                            <span>{user && user.name}</span>
                        </Link>

                        <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item" to="/dashboard">Dashboard</Link>
                            )}
                            <Link className="dropdown-item" to="/orders/me">Orders</Link>
                            <Link className="dropdown-item" to="/me">Profile</Link>

                            <Link
                                className="dropdown-item text-danger" to="/" onClick={logoutHandler}
                            >
                                Logout
                            </Link>
                        </div>
                    </div>) : <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>
                    } 

 


                    </div>
                </div>
            </div>
            </div>

            <nav className="navbar row">
            
                <Link to="/" style={{ textDecoration: 'none' }} >
                    <div className="col-12 col-md-3">
                        <div className="navbar-brand">
                            <img src="./images/shopit_logo.png" alt="Shopit Logo" width="200" height="60"/>
                        </div>
                    </div>
                </Link>
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to="/cart" style={{ textDecoration: 'none' }} className="cart-container">
                        <span id="cart" className="ml-4">
                            <FaShoppingCart />
                        </span>
                        {cartItems.length > 0 && (
                            <span className="ml-1" id="cart_count">
                            {cartItems.length}
                            </span>
                        )}
                    </Link>
                    

                </div>
            </nav>
        </Fragment>
    )
}

export default Header