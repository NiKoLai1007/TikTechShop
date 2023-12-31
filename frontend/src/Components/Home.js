import React, { Fragment, useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import MetaData from './Layout/Metadata'
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import Product from './Product/Product';
import Loader from './Layout/Loader'
import Pagination from 'react-js-pagination'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Header from './Layout/Header';

const categories = [
    'Womens',
    'Mens',
    'Kids',
    'Sports',
    'Smart',
    'Home'
]
const Home = () => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [error, setError] = useState()
    const [productsCount, setProductsCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1);
    const [resPerPage, setResPerPage] = useState(0)
    const [filteredProductsCount, setFilteredProductsCount] = useState(0)
    const [price, setPrice] = useState([1, 1000]);
    const [category, setCategory] = useState('');
    let { keyword } = useParams();

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);

    const getProducts = async (currentPage = 1, keyword = '', price, category = '') => {
        let link = `http://localhost:4001/api/v1/products?page=${currentPage}&keyword=${keyword}`;
    
        if (category) {
            link += `&category=${category}`;
        }
    
        try {
            let res = await axios.get(link);
            setProducts(res.data.products);
            setResPerPage(res.data.resPerPage);
            setProductsCount(res.data.productsCount);
            setFilteredProductsCount(res.data.filteredProductsCount);
            setLoading(false);
        } catch (error) {
            setError(error.response.data.message);
            setLoading(false);
        }
    }
    

    let count = productsCount;

    if (keyword) {
        count = filteredProductsCount
    }
    function setCurrentPageNo(pageNumber) {
    console.log('Current page:', pageNumber);
    setCurrentPage(pageNumber);
    }

    const loadUser = async () => {
        try {
            
            const { data } = await axios.get('/api/v1/me')
    
        } catch (error) {
            console.log( error.response.data.message)
            
        }
    }

    useEffect(() => {
        getProducts(currentPage, keyword, price, category)
    }, [currentPage, keyword, price, category])
   
    return (
        <>
            {loading ? <Loader /> : (<Fragment>
                <MetaData title={'Buy Best Products Online'} />
                
                <div className="container container-fluid">
                <section id="carousel" className="mt-5">
                    <Carousel>
                       
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/images/FinalS2.png"
                                alt="Second slide"
                                style={{ height: '400px' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/images/FinalS3.png"
                                alt="Third slide"
                                style={{ height: '400px' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/images/FinalS4.png"
                                alt="Fourth slide"
                                style={{ height: '400px' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/images/FinalS5.png"
                                alt="Fifth slide"
                                style={{ height: '400px' }}
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="/images/FinalS1.png"
                                alt="First slide"
                                style={{ height: '400px' }}
                            />
                        </Carousel.Item>
                    </Carousel>
                </section>
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">

                        <div className="row">
                            {keyword ? (
                                <Fragment>
                                    <div className="col-6 col-md-3 mt-5 mb-5">
                                        <div className="px-5">
                                            <Range
                                                marks={{
                                                    1: `$1`,
                                                    1000: `$1000`
                                                }}
                                                min={1}
                                                max={1000}
                                                defaultValue={[1, 1000]}
                                                tipFormatter={value => `$${value}`}
                                                tipProps={{
                                                    placement: "top",
                                                    visible: true
                                                }}
                                                value={price}
                                                onChange={price => setPrice(price)}
                                            />
                                            <hr className="my-5" />
                                            <div className="mt-5">
                                                <h4 className="mb-3">
                                                    Categories
                                                </h4>
                                                <ul className="pl-0">
                                                    {categories.map(category => (
                                                        <li
                                                            style={{
                                                                cursor: 'pointer',
                                                                listStyleType: 'none'
                                                            }}
                                                            key={category}
                                                            onClick={() => setCategory(category)}
                                                        >
                                                            {category}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-6 col-md-9">
                                        <div className="row">
                                            {products.map(product => (
                                                <Product key={product._id} product={product} col={4} />
                                            ))}
                                        </div>
                                    </div>
                                </Fragment>
                            ) : (
                                products.map(product => (
                                    <Product key={product._id} product={product} col={3} />
                                ))
                            )}

                        </div>
                    </section>
                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>)}
                </div>
            </Fragment>
            )}
        </>

    )
}

export default Home