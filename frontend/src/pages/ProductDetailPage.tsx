import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  RotateCcw, 
  Shield, 
  ChevronRight,
  Copy,
  MessageCircle,
  MessageSquare,
  Send,
  Check,
  X
} from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import ProductCard from '../components/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, relatedProducts, isLoading } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const product = getProductById(id || '');
  
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
    setActiveTab('description');
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleShare = async (method: string) => {
    if (!product) return;

    const productUrl = window.location.href;
    const shareText = `Check out ${product.name} on SwiftCart!\n${productUrl}`;

    switch (method) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(productUrl);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${product.name} on SwiftCart!`)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(shareText)}`, '_blank');
        break;
    }

    setShowShareModal(false);
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="bg-gray-300 h-96 w-full rounded-lg mb-4"></div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-300 h-20 w-20 rounded"></div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-6"></div>
              <div className="h-10 bg-gray-300 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-6 text-sm">
        <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-gray-700">{product.category}</Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={product.images ? product.images[selectedImage] : product.image} 
              alt={product.name} 
              className="w-full h-96 object-contain"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-md overflow-hidden ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - view ${index + 1}`} 
                    className="w-20 h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{product.reviewCount} reviews</span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="ml-2 text-gray-500 line-through">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Short Description */}
          <p className="text-gray-600 mb-6">{product.shortDescription || product.description}</p>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <span className="mr-4 font-medium">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-1 border-r border-gray-300"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-1 border-l border-gray-300"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button 
              onClick={handleAddToCart}
              className="btn btn-primary flex-1 flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </button>
            <button 
              onClick={handleWishlistToggle}
              className={`btn btn-outline flex items-center justify-center ${
                isInWishlist(product.id) ? 'text-red-500 border-red-500' : ''
              }`}
            >
              <Heart 
                className="h-5 w-5 mr-2"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              />
              {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
          
          {/* Product Features */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over ₹50</p>
                </div>
              </div>
              <div className="flex items-start">
                <RotateCcw className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium">Secure Payments</h4>
                  <p className="text-sm text-gray-600">Protected by encryption</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Share */}
          <div className="flex items-center mt-6">
            <span className="text-gray-600 mr-4">Share:</span>
            <div className="relative">
              <button 
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Share2 className="h-5 w-5 text-gray-500" />
              </button>

              {/* Share Modal */}
              {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Share Product</h3>
                      <button 
                        onClick={() => setShowShareModal(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <button 
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {copySuccess ? (
                          <Check className="h-5 w-5 text-green-500 mr-3" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-500 mr-3" />
                        )}
                        <span>{copySuccess ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare('whatsapp')}
                        className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <MessageSquare className="h-5 w-5 text-green-500 mr-3" />
                        <span>Share via WhatsApp</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare('telegram')}
                        className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Send className="h-5 w-5 text-blue-500 mr-3" />
                        <span>Share via Telegram</span>
                      </button>
                      
                      <button 
                        onClick={() => handleShare('sms')}
                        className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <MessageCircle className="h-5 w-5 text-gray-500 mr-3" />
                        <span>Share via Messages</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full ml-2 ${
                isInWishlist(product?.id || '') 
                  ? 'bg-red-50 text-red-500' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Heart 
                className="h-5 w-5" 
                fill={isInWishlist(product?.id || '') ? 'currentColor' : 'none'} 
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Product Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({product.reviewCount})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}
          
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Brand</th>
                      <td className="py-3 text-gray-900">{product.brand || 'ShopEase'}</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Category</th>
                      <td className="py-3 text-gray-900">{product.category}</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Weight</th>
                      <td className="py-3 text-gray-900">0.5 kg</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Dimensions</th>
                      <td className="py-3 text-gray-900">10 × 10 × 10 cm</td>
                    </tr>
                    <tr className="border-t border-b border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Color</th>
                      <td className="py-3 text-gray-900">Various</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Delivery</th>
                      <td className="py-3 text-gray-900">3-5 business days</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Shipping</th>
                      <td className="py-3 text-gray-900">Free on orders over ₹50</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Returns</th>
                      <td className="py-3 text-gray-900">30-day return policy</td>
                    </tr>
                    <tr className="border-t border-b border-gray-200">
                      <th className="py-3 text-left text-gray-500 font-normal">Warranty</th>
                      <td className="py-3 text-gray-900">1 year limited warranty</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <span className="text-3xl font-bold mr-2">{product.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <span className="text-gray-600">Based on {product.reviewCount} reviews</span>
              </div>
              
              <div className="space-y-6">
                {/* Sample reviews - in a real app, these would come from the API */}
                {[
                  {
                    name: "John D.",
                    rating: 5,
                    date: "2 months ago",
                    comment: "Great product! Exactly as described and arrived quickly."
                  },
                  {
                    name: "Sarah M.",
                    rating: 4,
                    date: "1 month ago",
                    comment: "Good quality for the price. Would recommend to others looking for this type of product."
                  },
                  {
                    name: "Michael P.",
                    rating: 5,
                    date: "3 weeks ago",
                    comment: "Exceeded my expectations. Will definitely purchase from this store again."
                  }
                ].map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-medium">{review.name}</span>
                      <span className="mx-2">•</span>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button className="btn btn-outline">Write a Review</button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;