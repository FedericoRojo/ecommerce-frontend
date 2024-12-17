import { useEffect, useState } from 'react';
import '../styles/Footer.css';

function Footer() {

  return (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-section about">
            <h3>About Us</h3>
            <p>
                We are a leading e-commerce platform offering a wide range of products to meet your needs. Our mission is to deliver quality and convenience.
            </p>
            </div>

            <div className="footer-section customer-service">
            <h3>Customer Service</h3>
            <ul>
                <li><a href="#">Ayuda</a></li>
            </ul>
            </div>

            <div className="footer-section social-media">
            <h3>Seguinos</h3>
            <div className="social-links">
                <a href="#"><i className="fa-brands fa-facebook"></i></a>
                <a href="#"><i className="fa-brands fa-instagram"></i></a>
            </div>
            </div>

            
        </div>
        <div className="footer-bottom">
            <p>&copy; 2024 Fotoestudio. All rights reserved.</p>
        </div>
        </footer>
  )
}

export default Footer;
