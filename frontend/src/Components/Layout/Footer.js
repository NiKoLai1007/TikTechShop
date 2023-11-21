import React, { Fragment } from 'react';

const Footer = () => {
    return (
        <Fragment>
            <footer className="py-1">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <h4>Contact Us</h4>
                            <p>
                                <strong>Tich Tech</strong><br />
                                123 Time Square, Cityville<br />
                                Watchland, WZ 54321<br />
                                <i className="fa fa-phone"></i> +1 (555) 123-4567
                            </p>
                        </div>

                        <div className="col-md-4">
                            <h4>Quick Links</h4>
                            <ul className="list-unstyled" >
                                <li><a href="#">Home</a></li>
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Contact Us</a></li>
                            </ul>
                        </div>

                        <div className="col-md-4">
                            <h4>Stay Connected</h4>
                            <p>Follow us on social media for the latest updates and promotions.</p>
                            <ul className="list-inline">
                                <li><a href="#" target="_blank"><i className="fa fa-facebook"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="#" target="_blank"><i className="fa fa-instagram"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bottom-footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <p className="text-center">
                                    &copy; 2023 Tick Tech . All rights reserved. | Designed by BSIT-NS-3A-T 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </Fragment>
    );
};

export default Footer;
