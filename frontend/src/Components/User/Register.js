import React, { Fragment, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Metadata from '../Layout/Metadata'
import axios from 'axios'

const Register = () => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })

    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
   

    let navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
        if (error) {
            console.log(error)
           setError()
        }

    }, [error. isAuthenticated, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

<<<<<<< HEAD
=======
        // Basic validation
        const validationErrors = {};
        if (!name || !name.trim()) {
            validationErrors.name = 'Name is required';
        }
        if (!email || !email.trim()) {
            validationErrors.email = 'Email is required';
        }
        if (!password || !password.trim()) {
            validationErrors.password = 'Password is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48
        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('password', password);
        formData.set('avatar', avatar);

<<<<<<< HEAD
        register(formData)
    }
=======
        register(formData);
    };

    const onChange = (e) => {
        if (!e.target) {
            return;
        }

        setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48

    const onChange = e => {
        if (e.target.name === 'avatar') {
<<<<<<< HEAD
=======
            const file = e.target.files && e.target.files[0];
            if (!file) {
                return;
            }
>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48

            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])

<<<<<<< HEAD
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
=======
            reader.readAsDataURL(file);
        } else {
            setUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48
        }
    }

    const register = async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(`http://localhost:4001/api/v1/register`, userData, config)
            console.log(data.user)
            setIsAuthenticated(true)
            setLoading(false)
            setUser(data.user)
            navigate('/')

        } catch (error) {
            setIsAuthenticated(false)
            setLoading(false)
            setUser(null)
            setError(error.response.data.message)
            console.log(error.response.data.message)
        }
    }


    return (
        <Fragment>

            <Metadata title={'Register User'} />

            <div className="row wrapper justify-content-center">
            <div className="col-12 col-md-5">
                    <img
                        src="images/loginpic2.png"
                        alt="Your Image"
                        className="img-fluid"
                        style={{ height: '450px' }}
                    />
            </div>
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
<<<<<<< HEAD
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
=======
                                        type="file"
                                        name="avatar"
                                        className="custom-file-input"
                                        id="customFile"
>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            // disabled={loading ? false : true}
                        >
                            REGISTER
                        </button>
<<<<<<< HEAD
=======
                        <Link to="/register" className="float-right mt-3">
                            Already Have an Account?
                        </Link>

                        {errors.general && <div className="text-danger mt-3">{errors.general}</div>}
>>>>>>> b265d451e24f428aac5af3d6bdf13bfd99553b48
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Register