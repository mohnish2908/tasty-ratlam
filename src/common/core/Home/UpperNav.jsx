import React, { useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const UpperNav = () => {
    const arr = [
        "Get 5% Discount on Minimum Purchase of 499 With Code 'SAVER5' 💰",
        "Get a free pack of chili chips 🌶️ with any combo! Use code 'COMBO'.",
        "Free Delivery on orders over ₹999 🚚",
    ];
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState('next'); // Track direction ('next' or 'prev')

    const next = () => {
        setDirection('next');
        setIndex((prevIndex) => (prevIndex + 1) % arr.length);
    };

    const prev = () => {
        setDirection('prev');
        setIndex((prevIndex) => (prevIndex - 1 + arr.length) % arr.length);
    };

    return (
        <div className="w-full bg-yellow-500 text-center text-black flex justify-center items-center">
            {/* Inner Container */}
            <div className="w-[90%] sm:w-[70%] text-center text-black flex justify-between items-center">
                {/* Previous Arrow */}
                <IoIosArrowBack onClick={prev} className="cursor-pointer text-2xl sm:text-3xl text-black p-2" />
                
                {/* Sliding Text Container */}
                <div className="overflow-hidden w-full relative flex-grow ">
                    <div
                        className={`flex transition-transform duration-500 ease-in-out`}
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {arr.map((text, idx) => (
                            <div
                                key={idx}
                                className="w-full text-center shrink-0 text-sm sm:text-base whitespace-normal py-2 flex justify-center items-center"
                            >
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Arrow */}
                <IoIosArrowForward onClick={next} className="cursor-pointer text-2xl sm:text-3xl text-black p-2" />
            </div>
        </div>
    );
};

export default UpperNav;