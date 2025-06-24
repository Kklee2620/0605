import React from 'react';
import { Breadcrumb } from '../components/Breadcrumb';
import { RoutePath } from '../constants';

export const PrivacyPolicyPage: React.FC = () => {
  const breadcrumbItems = [
    { name: 'Home', path: RoutePath.Home },
    { name: 'Privacy Policy' }
  ];

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <em>Last Updated: {new Date().toLocaleDateString()}</em>
          </p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to ModernStore. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at privacy@modernstore.example.com.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">2. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed">
              We collect personal information that you voluntarily provide to us when you register on the ModernStore, express an interest in obtaining information about us or our products and Services, when you participate in activities on the ModernStore or otherwise when you contact us. The personal information that we collect depends on the context of your interactions with us and the ModernStore, the choices you make and the products and features you use.
            </p>
            {/* Add more specific examples as needed */}
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We use personal information collected via our ModernStore for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
             {/* Add more specific examples as needed */}
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">4. Will Your Information Be Shared With Anyone?</h2>
            <p className="text-gray-700 leading-relaxed">
             We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. (Placeholder - this needs to be specific to actual practices).
            </p>
          </section>

           <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">5. How Long Do We Keep Your Information?</h2>
            <p className="text-gray-700 leading-relaxed">
             We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). (Placeholder).
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">6. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              In some regions (like the EEA and UK), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information. (Placeholder).
            </p>
          </section>
          
          <p className="text-gray-700 leading-relaxed mt-8">
            This is a template privacy policy. For a real application, you would need to consult with a legal professional to ensure it accurately reflects your data handling practices and complies with all applicable laws and regulations.
          </p>
        </div>
      </div>
    </div>
  );
};
