import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoutePath } from '../constants';

export const ShippingPolicyPage: React.FC = () => {
  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: 'Shipping Policy' }
  ];

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <em>Last Updated: {new Date().toLocaleDateString()}</em>
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">1. Order Processing Time</h2>
            <p className="text-gray-700 leading-relaxed">
              All orders are processed within 1-2 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">2. Shipping Rates and Delivery Estimates</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Shipping charges for your order will be calculated and displayed at checkout.
            </p>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
                <li><strong>Standard Shipping:</strong> FREE (5-7 business days) - Placeholder</li>
                <li><strong>Expedited Shipping:</strong> $15.00 (2-3 business days) - Placeholder</li>
            </ul>
             <p className="text-gray-700 leading-relaxed mt-2">
              Please note that delivery times are estimates and may vary due to carrier delays or other unforeseen circumstances.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">3. International Shipping</h2>
            <p className="text-gray-700 leading-relaxed">
              At this time, we only ship to addresses within [Your Country/Region - e.g., the United States]. We do not offer international shipping. (Placeholder - adjust as needed).
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">4. Order Tracking</h2>
            <p className="text-gray-700 leading-relaxed">
             Once your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
            </p>
          </section>

           <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">5. Shipping to P.O. Boxes</h2>
            <p className="text-gray-700 leading-relaxed">
             Some carriers have limitations regarding P.O. Boxes. If we are unable to ship to your P.O. Box, we will contact you for an alternative address. (Placeholder).
            </p>
          </section>
          
          <p className="text-gray-700 leading-relaxed mt-8">
            This is a template shipping policy. Please adapt it to your specific shipping practices and partners.
          </p>
        </div>
      </div>
    </div>
  );
};
