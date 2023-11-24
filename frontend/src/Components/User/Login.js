import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loader from '../Layout/Loader'
import Metadata from '../Layout/Metadata'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {authenticate} from '../../utils/helpers'
import { getUser } from '../../utils/helpers';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()
    let location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
    const notify = (error) => toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const login = async (email, password) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.post(`http://localhost:4001/api/v1/login`, { email, password }, config)
            console.log(data)
            authenticate(data, () => navigate("/"))
            
        } catch (error) {
            toast.error("invalid user or password", {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    const submitHandler = (e) => {
        e.preventDefault();
        login(email, password)
    }

    useEffect(() => {
        if (getUser() && redirect === 'shipping' ) {
             navigate(`/${redirect}`)
        }
    }, [])

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <Metadata title={'Login'} />

                    
                    <div className="login row wrapper justify-content-center">
                            <div className="col-12 col-md-5">
                           
                                <img
                                    src="images/loginpic2.png"
                                    alt="Your Image"
                                    className="img-fluid"
                                    style={{  height: '450px' }}
                                
                                />
                        
                            </div>
    
                        <div className="col-12 col-md-4 ">
                            
                            <form
                            className="hey"
                            onSubmit={submitHandler}
                            style={{ borderRadius: '30px' }}
                            >
                            <h1 className="mb-3 font-weight-bold">Login</h1>
                            <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Link to="/password/forgot" className="float-right mb-4">
                                Forgot Password?
                            </Link>

                            <button
                                id="login_button"
                                type="submit"
                                className="btn btn-block py-3"
                            >
                                LOGIN
                            </button>

                            <Link to="/register" className="float-right mt-3">
                                New User?
                            </Link>
                            </form>
                        </div>
                       
                       
                    </div>



                </Fragment>
            )}
        </Fragment>
    )
}

export default Login