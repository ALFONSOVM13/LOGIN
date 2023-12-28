import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import servicio from "../assets/SERVICIO.png"
import pcs from '../assets/pcs.png'

const Banner = () => {
    return (
        <Carousel data-bs-theme="light">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={servicio}
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={pcs}
                    alt="Second slide"
                />
            </Carousel.Item>
        </Carousel>
    );
};
export default Banner;

