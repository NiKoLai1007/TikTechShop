import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Metadata from '../Layout/Metadata';
import Sidebar from './SideBar';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryList from './CategoryList';

const NewProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [seller, setSeller] = useState('');
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  let navigate = useNavigate();

  const validateForm = () => {
    if (!name || !price || !description || !category || !brand || !stock || !seller || images.length === 0) {
      setError('All fields are required');
      return false;
    }

    if (isNaN(parseFloat(price)) || isNaN(parseInt(stock))) {
      setError('Price and stock must be valid numbers');
      return false;
    }

    if (parseFloat(price) <= 0 || parseInt(stock) < 0) {
      setError('Price must be greater than 0 and stock must be a non-negative number');
      return false;
    }

    setError('');
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.set('name', name);
    formData.set('price', price);
    formData.set('description', description);
    formData.set('category', category);
    formData.set('brand', brand);
    formData.set('stock', stock);
    formData.set('seller', seller);

    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      };

      console.log('Form Data:', formData);

      const { data } = await axios.post(`http://localhost:4001/api/v1/admin/product/new`, formData, config);

      setLoading(false);
      setSuccess(data.success);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesPreview([]);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
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
      setError(error.response?.data?.message || 'Unable to fetch categories');
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
      setError(error.response?.data?.message || 'Unable to fetch brands');
    }
  };

  useEffect(() => {
    getCategories();
    getBrands();

    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (success) {
      navigate('/admin/products');
      toast.success('Product created successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    setLoading(false); // Set loading to false after fetching categories and brands
  }, [error, success, navigate]);

  return (
    <Fragment>
      <Metadata title={'New Product'} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <div className="wrapper my-5">
              <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                <h1 className="mb-4">New Product</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input type="text" id="name_field" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input type="text" id="price_field" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea className="form-control" id="description_field" rows="8" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select className="form-control" id="category_field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="brand_field">Brand</label>
                  <select className="form-control" id="brand_field" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    {brands.map((brd) => (
                      <option key={brd._id} value={brd._id}>
                        {brd.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input type="number" id="stock_field" className="form-control" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="seller_field">Seller Name</label>
                  <input type="text" id="seller_field" className="form-control" value={seller} onChange={(e) => setSeller(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Images</label>
                  <div className="custom-file">
                    <input type="file" name="images" className="custom-file-input" id="customFile" onChange={onChange} multiple />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>
                  {imagesPreview.map((img) => (
                    <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                  ))}
                </div>

                {/* Display error message */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <button id="login_button" type="submit" className="btn btn-block py-3">
                  CREATE
                </button>
              </form>
            </div>
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default NewProduct;