import React, { useState } from 'react';
import img2 from '../../../assets/banner/2.png';
import img3 from '../../../assets/banner/3.png';
import img4 from '../../../assets/banner/4.png';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Banner = () => {
    const images = [img2, img3, img4];
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState('next'); // Track direction ('next' or 'prev')

    const next = () => {
        setDirection('next');
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prev = () => {
        setDirection('prev');
        setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="overflow-hidden w-full h-full  relative">
            {/* Image Container */}
            <div
                className="flex transition-transform duration-500 ease-in-out "
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {images.map((image, idx) => (
                    <img
                        key={idx}
                        src={image}
                        alt={`banner-${idx}`}
                        className={`w-full h-full flex-shrink-0 object-cover ${
                            direction === 'next'
                                ? 'animate-slide-left'
                                : 'animate-slide-right'
                        }`}
                    />
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center px-4 py-2">
                <button
                    onClick={prev}
                    className="cursor-pointer text-1xl text-black p-2"
                >
                    <IoIosArrowBack />
                </button>
                <button
                    onClick={next}
                    className="cursor-pointer text-1xl text-black p-2"
                >
                    <IoIosArrowForward />
                </button>
            </div>

            
        </div>
    );
};

export default Banner;