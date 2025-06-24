import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoutePath } from '../constants';

export const ReturnPolicyPage: React.FC = () => {
  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: 'Return & Refund Policy' }
  ];

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Return & Refund Policy</h1>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <em>Last Updated: {new Date().toLocaleDateString()}</em>
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">1. Returns</h2>
            <p className="text-gray-700 leading-relaxed">
              We want you to be completely satisfied with your purchase from ModernStore. If you are not satisfied with your product, you may return it within 30 days of the purchase date for a full refund or exchange, provided the item is in its original condition, unused, and with all original packaging and tags attached.
            </p>
             <p className="text-gray-700 leading-relaxed mt-2">
              Certain items may not be eligible for return (e.g., final sale items, custom orders). Please check the product description page for specific return information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">2. How to Initiate a Return</h2>
            <p className="text-gray-700 leading-relaxed">
              To initiate a return, please contact our customer service team at returns@modernstore.example.com with your order number and reason for return. We will provide you with a Return Merchandise Authorization (RMA) number and instructions on how to send back your item.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">3. Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Once we receive your returned item and inspect it, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days. Shipping costs are non-refundable.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">4. Exchanges</h2>
            <p className="text-gray-700 leading-relaxed">
             If you wish to exchange an item for a different size, color, or product, please initiate a return as described above and place a new order for the desired item.
            </p>
          </section>

           <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">5. Damaged or Incorrect Items</h2>
            <p className="text-gray-700 leading-relaxed">
             If you received a damaged or incorrect item, please contact us immediately at support@modernstore.example.com with photos of the item and your order number. We will arrange for a replacement or refund as quickly as possible.
            </p>
          </section>
          
          <p className="text-gray-700 leading-relaxed mt-8">
            This is a template return policy. Specific details should be tailored to your business operations.
          </p>
        </div>
      </div>
    </div>
  );
};
