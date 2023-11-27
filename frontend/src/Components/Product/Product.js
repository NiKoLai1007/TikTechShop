import React from "react";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <Link to={`/product/${product._id}`} className="card_3 card p-3 rounded">
        <img
          className="card-img-top"
          src={
            product.images && product.images.length > 0 && product.images[0].url
          }
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <a href={`/product/${product._id}`}>{product.name}</a>
          </h5>
          <p className="card-text">${product.price}</p>

          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${(product.ratings / 5) * 100}%` }}
              ></div>
            </div>
            <span id="no_of_reviews">({product.numOfReviews} reviews)</span>
          </div>
          
        </div>
      </Link>
    </div>
  );
};

export default Product;
