import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  
  const subtotal = cart.reduce((total, item) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return total + itemPrice * item.quantity;
  }, 0);
  
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Shopping Cart ({cart.length} items)</h2>
                  <button 
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.map((item) => {
                  const itemPrice = item.discount > 0 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center">
                      {/* Product Image */}
                      <div className="sm:w-20 sm:h-20 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              <Link to={`/products/${item.id}`}>{item.name}</Link>
                            </h3>
                            {item.discount > 0 && (
                              <div className="mt-1 flex items-center">
                                <span className="text-sm font-medium text-gray-900">${itemPrice.toFixed(2)}</span>
                                <span className="ml-2 text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 sm:mt-0 text-right">
                            <p className="text-base font-medium text-gray-900">${itemTotal.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-3 py-1 border-r border-gray-300"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-1 border-l border-gray-300"
                            >
                              +
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-6">
              <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <Link to="/checkout" className="btn btn-primary w-full">
                  Proceed to Checkout
                </Link>
              </div>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Free shipping on orders over $50</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;