import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProductStore } from '../stores/productStore';
import { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, isLoading, fetchProducts } = useProductStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get filter values from URL
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sort') || 'featured';
  
  // Local filter state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState({ min: minPrice, max: maxPrice });
  const [selectedSort, setSelectedSort] = useState(sortBy);
  
  useEffect(() => {
    // Fetch products based on URL params
    fetchProducts({
      category: categoryParam,
      search: searchQuery,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sort: sortBy
    });
  }, [categoryParam, searchQuery, minPrice, maxPrice, sortBy, fetchProducts]);
  
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
  const applyFilters = () => {
    // Update URL with filter params
    const params: Record<string, string> = {};
    
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    if (selectedSort) params.sort = selectedSort;
    
    setSearchParams(params);
  };
  
  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSelectedSort('featured');
    setSearchParams({});
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button 
          onClick={toggleFilters}
          className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-md"
        >
          <Filter className="h-5 w-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`w-full md:w-64 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={selectedCategory === category}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mr-2"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="input text-sm py-1"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="input text-sm py-1"
                />
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full btn btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-2 sm:mb-0">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
            
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  searchParams.set('sort', e.target.value);
                  setSearchParams(searchParams);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedCategory || priceRange.min || priceRange.max || searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory && (
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>Category: {selectedCategory}</span>
                  <button 
                    onClick={() => {
                      setSelectedCategory('');
                      searchParams.delete('category');
                      setSearchParams(searchParams);
                    }}
                    className="ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {(priceRange.min || priceRange.max) && (
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>
                    Price: {priceRange.min ? `$${priceRange.min}` : '$0'} - {priceRange.max ? `$${priceRange.max}` : 'Any'}
                  </span>
                  <button 
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      searchParams.delete('minPrice');
                      searchParams.delete('maxPrice');
                      setSearchParams(searchParams);
                    }}
                    className="ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  <span>Search: {searchQuery}</span>
                  <button 
                    onClick={() => {
                      searchParams.delete('search');
                      setSearchParams(searchParams);
                    }}
                    className="ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Products */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="bg-gray-300 h-64 w-full"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search term.</p>
              <button 
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;