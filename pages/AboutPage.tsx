import React from 'react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About ModernStore</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              At ModernStore, our mission is to bring you a curated selection of high-quality, modern products that enhance your lifestyle. We believe in the power of good design and functionality, offering items that are not only beautiful but also built to last.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Founded in [Year], ModernStore started with a simple idea: to make contemporary design accessible to everyone. What began as a small online boutique has grown into a beloved destination for discerning shoppers seeking style, quality, and value.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We partner with innovative designers and trusted manufacturers to ensure every product meets our high standards. Our team is passionate about finding unique pieces that you won't find anywhere else.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
              <li><span className="font-medium">Curated Selection:</span> Every item is handpicked for its design and quality.</li>
              <li><span className="font-medium">Customer Focus:</span> We're dedicated to providing an exceptional shopping experience.</li>
              <li><span className="font-medium">Fast & Reliable Shipping:</span> Get your modern finds delivered to your doorstep quickly.</li>
              <li><span className="font-medium">Secure Shopping:</span> Your privacy and security are our top priorities.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};