import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, Truck } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();
  
  const [step, setStep] = useState(1);
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  // Payment information state
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  // Shipping method state
  const [shippingMethod, setShippingMethod] = useState('standard');
  
  // Calculate order totals
  const subtotal = cart.reduce((total, item) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return total + itemPrice * item.quantity;
  }, 0);
  
  const shippingCost = shippingMethod === 'express' ? 15.99 : (subtotal > 50 ? 0 : 5.99);
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shippingCost + tax;
  
  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };
  
  // Handle place order
  const handlePlaceOrder = () => {
    // Create order
    createOrder({
      items: cart,
      shippingInfo,
      paymentInfo,
      shippingMethod,
      subtotal,
      shippingCost,
      tax,
      total
    });
    
    // Clear cart
    clearCart();
    
    // Redirect to success page
    navigate('/orders');
  };
  
  // Handle shipping info change
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle payment info change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  // If cart is empty, redirect to cart page
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="text-sm mt-1">Shipping</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="text-sm mt-1">Payment</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="text-sm mt-1">Review</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Truck className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">Shipping Information</h2>
                </div>
                
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="input"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-base font-medium mb-3">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Standard Shipping</p>
                          <p className="text-sm text-gray-500">Delivery in 3-5 business days</p>
                        </div>
                        <div className="text-right">
                          {subtotal > 50 ? (
                            <span className="text-green-600 font-medium">Free</span>
                          ) : (
                            <span>$5.99</span>
                          )}
                        </div>
                      </label>
                      <label className="flex items-center p-4 border rounded-md cursor-pointer">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <p className="font-medium">Express Shipping</p>
                          <p className="text-sm text-gray-500">Delivery in 1-2 business days</p>
                        </div>
                        <div className="text-right">
                          <span>$15.99</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">Payment Information</h2>
                </div>
                
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="input"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="XXX"
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
                      className="btn btn-outline"
                    >
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Check className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">Review Your Order</h2>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</span>
                    </p>
                    <p className="mb-1">{shippingInfo.address}</p>
                    <p className="mb-1">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p className="mb-1">{shippingInfo.country}</p>
                    <p className="mb-1">{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-1">
                      <span className="font-medium">{paymentInfo.cardName}</span>
                    </p>
                    <p className="mb-1">
                      Card ending in {paymentInfo.cardNumber.slice(-4)}
                    </p>
                    <p>Expires {paymentInfo.expiryDate}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">Order Items</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="divide-y divide-gray-200">
                      {cart.map((item) => {
                        const itemPrice = item.discount > 0 
                          ? item.price * (1 - item.discount / 100) 
                          : item.price;
                        const itemTotal = itemPrice * item.quantity;
                        
                        return (
                          <div key={item.id} className="py-3 flex items-center">
                            <div className="w-12 h-12 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${itemTotal.toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setStep(2)}
                    className="btn btn-outline"
                  >
                    Back to Payment
                  </button>
                  <button 
                    type="button" 
                    onClick={handlePlaceOrder}
                    className="btn btn-primary"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
            
            <div className="mb-6">
              <div className="max-h-60 overflow-y-auto">
                {cart.map((item) => {
                  const itemPrice = item.discount > 0 
                    ? item.price * (1 - item.discount / 100) 
                    : item.price;
                  
                  return (
                    <div key={item.id} className="flex items-center py-3 border-b border-gray-200 last:border-0">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(itemPrice * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;