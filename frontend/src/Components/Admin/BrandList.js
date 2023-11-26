import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MetaData from '../Layout/Metadata'
import Loader from '../Layout/Loader'
import Sidebar from './SideBar'
import axios from 'axios';
import { getToken, successMsg, errMsg } from '../../utils/helpers';
import Toast from '../Layout/Toast';

const BrandList = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [brand, setBrand] = useState([])
    const [isDeleted, setIsDeleted] = useState('')
    let navigate = useNavigate();
    
    const config = {
        headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${getToken()}`
        }
    }

    const listBrand = async () => {
        try {
            const config = {
                headers: {
                  Authorization: `Bearer ${getToken()}`,
                },
              };
            const { data } = await axios.get(`http://localhost:4001/api/v1/admin/brand`, config)
            setBrand(data.brand)
            setLoading(false)

        // } catch (error) {
        //     setError(error.response.data.message)
             } catch (err) {
                console.error('getBrand error:', err)
            
        }
    }

    const deleteBrand = async (id) => {
        try {
            const { data } = await axios.delete(`http://localhost:4001/api/v1/admin/brand/${id}`, config)
            setIsDeleted(data.success)
            setLoading(false)
            
        } catch (error) {
           setError(error.response.data.message)
            
        }
    }

    useEffect(() => {
        listBrand();
        if (error) {
            errMsg(error);
            setError('')
        }
        if (isDeleted) {
            successMsg('Brand deleted successfully');
            navigate('/admin/brand');

        }

    }, [error, deleteError, isDeleted,])


    const deleteBrandHandler = (id) => {
       deleteBrand(id)
    }
    
    const setBrands = () => {
        const data = {
            columns: [
                {
                    label: 'Brand ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Brand Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Image',
                    field: 'image',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }
        brand.forEach(brand => {
            data.rows.push({
                id: brand._id,
                name: brand.name,
                image: brand.images.url,
                actions: <Fragment>
                    <Link to={`/admin/brand/${brand._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteBrandHandler(brand._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })
        return data;
    }

    console.log(brand)
    return (
        <Fragment>
            <MetaData title={'All Brand'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Brands</h1>
                        <button className='procreate  ml-auto'>
                        <Link to="/admin/brand/new" className="procreate"><i className="fa fa-plus"></i>Create a Brand</Link>
                        </button>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setBrands()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
                    </Fragment>
                </div>
            </div>
        </Fragment>
    )
}

export default BrandList