import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="checkout-progress mt-5">
      <Link to="/shipping" className={`step ${shipping ? 'active-step' : 'incomplete'}`}>
        1. Shipping
      </Link>

      <Link to="/order/confirm" className={`step ${confirmOrder ? 'active-step' : 'incomplete'}`}>
        2. Confirm Order
      </Link>

      <Link to="/payment" className={`step ${payment ? 'active-step' : 'incomplete'}`}>
        3. Payment
      </Link>
    </div>
  );
};

export default CheckoutSteps;
