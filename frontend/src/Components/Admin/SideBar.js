import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
    return (
        // <div className="sidebar-wrapper">
        //     <nav id="sidebar">

                
        //         <ul className="side_1 list-unstyled components">
        //             <li className='menu-title'>Main </li>
        //             <li>
        //                 <Link to="/dashboard"><i className="fa fa-home" ></i> Dashboard</Link>
        //             </li>

                    // <li>
                    //     <a href="#productSubmenu" data-toggle="collapse" aria-expanded="false" className="dropdown-toggle"><i
                    //         className="fa fa-product-hunt"></i> Products</a>
                    //     <ul className="collapse list-unstyled" id="productSubmenu">
                    //         <li>
                    //             <Link to="/admin/products"><i className="fa fa-clipboard"></i> All</Link>
                    //         </li>

                    //         <li>
                    //             <Link to="/admin/product"><i className="fa fa-plus"></i> Create</Link>
                    //         </li>
                    //     </ul>
                    // </li>

        //             <li>
        //                 <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
        //             </li>

        //             <li>
        //                 <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
        //             </li>

        //             <li>
        //                 <Link to="/admin/reviews"><i className="fa fa-star"></i> Reviews</Link>
        //             </li>

        //         </ul>

        //         <div className="sb-sidenav-footer">
        //             <div className="small">Logged in as:</div>
        //             Admin
        //         </div>
        //     </nav>
        // </div>
        <nav id="sidebar">
      <div className="sidebar-header">
        <h3 style={{ fontSize: '1.5rem' }}>Admin Panel</h3>
      </div>
      <div className="sidebar-wrapper">
        <ul className="list-unstyled components">
          <li className="menu-title" style={{ fontSize: '1.2rem' }}>Main </li>
          <li>
            <Link to="/dashboard">
              <i className="fa fa-home" style={{ fontSize: '1.2rem' }}></i> Dashboard
            </Link>
          </li>
          <br />
          <li className="menu-title" style={{ fontSize: '1.2rem' }}>Components </li>
          <li>
            <Link to="/admin/products" style={{ fontSize: '1.2rem' }}>
              <i className="fa fa-product-hunt"></i> Products
            </Link>
          </li>
          <li>
            <Link to="/admin/Category" style={{ fontSize: '1.2rem' }}>
              <i className="fa fa-list"></i> Category
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" style={{ fontSize: '1.2rem' }}>
              <i className="fa fa-shopping-basket"></i> Orders
            </Link>
          </li>

          <li>
            <Link to="/admin/users" style={{ fontSize: '1.2rem' }}>
              <i className="fa fa-users"></i> Users
            </Link>
          </li>

          <li>
            <Link to="/admin/reviews" style={{ fontSize: '1.2rem' }}>
              <i className="fa fa-star"></i> Reviews
            </Link>
          </li>
        </ul>
      </div>
      <div className="sb-sidenav-footer">
        <div className="small " style={{ fontSize: '1rem' }}>Logged in as:</div>
        Admin
      </div>
    </nav>
      
    )
}

export default Sidebar