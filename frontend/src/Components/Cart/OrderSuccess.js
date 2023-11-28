import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import MetaData from '../Layout/Metadata';

const OrderSuccess = () => {
    sessionStorage.removeItem('orderInfo');
    localStorage.clear();

    return (
        <Fragment>
            <MetaData title={'Order Success'} />

            <div className="row justify-content-center">
                <div className="col-8 mt-5 text-center">
                    {/* Updated image styling */}
                    <img
                        className="my-5 img-fluid d-block mx-auto"
                        src="/images/order.png"
                        alt="Order Success"
                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                    />

                    {/* Updated heading styling */}
                    <h2 style={{ color: 'green', fontSize: '24px' }}>
                        Congratulations! Your Order has been placed successfully.
                    </h2>

                    {/* Updated link styling */}
                    <Link to="/orders/me" className="btn btn-primary mt-3">
                        View My Orders
                    </Link>
                    <br/><br/>
                </div>
                
            </div>
        </Fragment>
    );
};

export default OrderSuccess;
