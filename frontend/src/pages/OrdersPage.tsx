import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronRight, Truck, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useOrderStore } from '../stores/orderStore';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);
  
  if (!isAuthenticated) {
    navigate('/login?redirect=orders');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start shopping to place your first order.
          </p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                      <span className="ml-4 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                    <Link 
                      to={`/orders/${order.id}`} 
                      className="ml-4 text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Order Progress */}
                <div className="mb-6">
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status !== 'Pending' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="text-xs mt-1">Confirmed</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === 'Shipped' || order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Package className="h-5 w-5" />
                        </div>
                        <span className="text-xs mt-1">Processing</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === 'Shipped' ? 'bg-blue-500 text-white' : (
                            order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          )
                        }`}>
                          <Truck className="h-5 w-5" />
                        </div>
                        <span className="text-xs mt-1">Shipped</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          order.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="text-xs mt-1">Delivered</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ 
                          width: order.status === 'Pending' ? '0%' : (
                            order.status === 'Processing' ? '33%' : (
                              order.status === 'Shipped' ? '66%' : '100%'
                            )
                          )
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.slice(0, 2).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">
                          <Link to={`/products/${item.id}`} className="hover:text-blue-600">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500">
                      + {order.items.length - 2} more items
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;