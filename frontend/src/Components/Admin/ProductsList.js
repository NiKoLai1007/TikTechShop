import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    let navigate = useNavigate();

    const getAdminProducts = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/products`, config);
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const getCategories = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/category`, config);
            setCategories(data.category);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const getBrands = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };

            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/brand`, config);
            setBrands(data.brand);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        getAdminProducts();
        getCategories();
        getBrands();

        if (error) {
            toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }

        if (isDeleted) {
            toast.success('Product deleted successfully', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            navigate('/admin/products');
        }
    }, [error, deleteError, isDeleted]);

    const deleteProduct = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.delete(`http://localhost:4001/api/v1/admin/product/${id}`, config);
            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setDeleteError(error.response.data.message);
        }
    };

    const productsList = () => {
        const data = {
            columns: [
                { label: 'ID', field: 'id', sort: 'asc' },
                { label: 'Name', field: 'name', sort: 'asc' },
                { label: 'Price', field: 'price', sort: 'asc' },
                { label: 'Category', field: 'category', sort: 'asc' },
                { label: 'Brand', field: 'brand', sort: 'asc' },
                { label: 'Stock', field: 'stock', sort: 'asc' },
                { label: 'Actions', field: 'actions', width: 150 },
            ],
            rows: [],
        };

        products.forEach((product) => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                category: categories.find((cat) => cat._id === product.category)?.name || '',
                brand: brands.find((brd) => brd._id === product.brand)?.name || '',
                actions: (
                    <Fragment>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary mx-1">
                            <i className="fa fa-pencil"></i> Edit
                        </Link>
                        <button className="btn btn-danger mx-1" onClick={() => deleteProductHandler(product._id)}>
                            <i className="fa fa-trash"></i> Delete
                        </button>
                    </Fragment>
                ),
            });
        });

        return data;
    };

    const deleteProductHandler = (id) => {
        deleteProduct(id);
    };

    const customTableStyle = {
      border: '2px solid #007BFF', // Set border color to blue
      borderRadius: '8px',
      backgroundColor: '#CEE4FD',
    };

    return (
        <Fragment>
            <MetaData title={'All Products'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>
                        <button className="btn btn-success mb-3">
                            <Link to="/admin/product" className="text-white">
                                <i className="fa fa-plus"></i> Create a Product
                            </Link>
                        </button>
                        {loading ? (
                            <Loader />
                        ) : (
                            <MDBDataTable
                                data={productsList()}
                                className="px-5"
                                bordered
                                striped
                                hover
                                noBottomColumns // hide the bottom pagination and search bar
                                style={customTableStyle} // Apply custom styles to the table
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default ProductsList;
