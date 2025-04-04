import React from 'react';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';

const About = () => {
  return (
    <>
    <NavBar/>
    <div className="container mx-auto p-6 text-gray-800 w-1/2">
    
      <h1 className="text-3xl font-bold mb-4 text-center">About Us</h1>
      <p className="mb-6 text-lg">
        Welcome to <strong>Tasty Ratlam</strong>, your go-to destination for authentic and flavorful namkeen and snacks inspired by the rich culinary heritage of Ratlam. We’re passionate about bringing you the finest quality snacks that celebrate tradition while catering to modern tastes.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
      <p className="mb-6 text-lg">
        <strong>Tasty Ratlam</strong> began with a simple yet heartfelt idea: to share the unique and vibrant flavors of Ratlam with snack lovers across the country. Established on <strong>October 20</strong>, a date close to our hearts, we’ve made it our mission to source the best ingredients and create snacks that capture the essence of Ratlam’s renowned namkeen culture.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">What Makes Us Special</h2>
      <ul className="list-disc pl-6 mb-6 text-lg">
        <li><strong>Authentic Recipes:</strong> Our snacks are crafted using traditional recipes that have been perfected over generations.</li>
        <li><strong>Premium Ingredients:</strong> We partner with trusted local vendors to ensure every bite is fresh, flavorful, and of the highest quality.</li>
        <li><strong>Wide Range of Products:</strong> From crispy <strong>Ratlami Sev</strong> to wholesome <strong>Banana Chips</strong>, our diverse offerings are designed to suit every palate.</li>
        <li><strong>Customer-Centric Approach:</strong> Your satisfaction is our priority. We’re committed to delivering snacks that delight and bring a smile to your face.</li>
      </ul>
      
      <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
      <p className="mb-6 text-lg">
        At <strong>Tasty Ratlam</strong>, we aim to be more than just a namkeen brand. We aspire to create a community of snack enthusiasts who value quality, tradition, and unforgettable taste. Whether it’s a festive celebration or a casual tea-time, we’re here to make every moment more delicious.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">Join Us on This Flavorful Journey</h2>
      <p className="mb-6 text-lg">
        We’re just getting started, and the best is yet to come! Explore our range of snacks, follow us on social media, and share your <strong>Tasty Ratlam</strong> experience with us. Together, let’s celebrate the love for authentic and delightful snacks, one bite at a time.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
      <p className="mb-2 text-lg"><strong>Phone:</strong> +91 8871882172</p>
      <p className="mb-2 text-lg"><strong>Email:</strong> info@tastyratlam.com</p>
      <p className="mb-2 text-lg"><strong>Address:</strong> Tasty Ratlam, Dhiraj Shah Nagar, Ratlam, (M.P.), India - 457001</p>
      <p className="mb-6 text-lg"><strong>FSSAI Registration Number:</strong> 21424810001736</p>
      
      <p className="text-center font-semibold">Thank you for choosing <strong>Tasty Ratlam</strong>—where tradition meets taste!</p>
      
    </div>
    <Footer/>
    </>
  );
};

export default About;
