import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata';
import Loader from '../Layout/Loader';
import Sidebar from './SideBar';
import axios from 'axios';
import { getToken, successMsg, errMsg } from '../../utils/helpers';
import Toast from '../Layout/Toast';

const CategoryList = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [category, setCategory] = useState([]);
    const [isDeleted, setIsDeleted] = useState('');
    let navigate = useNavigate();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };

    const listCategory = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            };
            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/category`, config);
            setCategory(data.category);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    const deleteCategory = async (id) => {
        try {
            const { data } = await axios.delete(`http://localhost:4001/api/v1/admin/category/${id}`, config);
            setIsDeleted(data.success);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        listCategory();
        if (error) {
            errMsg(error);
            setError('');
        }
        if (isDeleted) {
            successMsg('Category deleted successfully');
            navigate('/admin/category');
        }
    }, [error, deleteError, isDeleted]);

    const deleteCategoryHandler = (id) => {
        deleteCategory(id);
    };

    const setCategories = () => {
        const data = {
            columns: [
                {
                    label: 'Category ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Category Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };
        category.forEach((category) => {
            data.rows.push({
                id: category._id,
                name: category.name,
                actions: (
                    <Fragment>
                        <Link to={`/admin/category/${category._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <button
                            className="btn btn-danger py-1 px-2 ml-2"
                            onClick={() => deleteCategoryHandler(category._id)}
                        >
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
            });
        });
        return data;
    };

    return (
        <Fragment>
            <MetaData title={'All Category'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-4">All Category</h1>
                        <button className="procreate ml-auto">
                            <Link to="/admin/category/new" className="procreate">
                                <i className="fa fa-plus"></i>Create a Category
                            </Link>
                        </button>
                        {loading ? (
                            <Loader />
                        ) : (
                            <MDBDataTable
                                data={setCategories()}
                                className="px-3"
                                bordered
                                striped
                                hover
                                noBottomColumns // hide the bottom pagination and search bar
                                style={{
                                    border: '2px solid #007BFF', // Set border color to blue
                                    borderRadius: '8px',
                                    backgroundColor: '#CEE4FD', // Set background color to light blue
                                }}
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    );
};

export default CategoryList;
