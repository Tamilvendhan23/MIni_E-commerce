import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/" className="btn btn-primary flex items-center justify-center">
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        <Link to="/products" className="btn btn-outline flex items-center justify-center">
          <Search className="h-5 w-5 mr-2" />
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;