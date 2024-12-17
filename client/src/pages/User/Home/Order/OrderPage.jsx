import OrderCard from "@/components/Order/OrderCard";

// Mock data for design purposes
const mockOrders = [
  {
    orderId: "INF-20241216-0001",
    orderSource: "cart",
    userId: "user123",
    productId: "product123",
    product: {
      name: "Premium Cotton T-Shirt",
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ],
      variant: {
        variantName: "Size",
        variantTypes: [
          { name: "S", price: 599, stock: 10 },
          { name: "M", price: 599, stock: 15 },
          { name: "L", price: 649, stock: 20 },
        ],
      },
      discount: 10,
    },
    selectedVariant: 1,
    quantity: 2,
    originalPrice: 1198,
    discount: 10,
    finalPrice: 1078.2,
    status: "pending",
    payment: {
      method: "UPI",
      status: "completed",
      transactionId: "txn_123456",
    },
    shipping: {
      trackingId: "SHIP123456",
      partner: "BlueDart",
      expectedDeliveryDate: "2024-12-20",
    },
    createdAt: "2024-12-16T14:30:00Z",
  },
  {
    orderId: "INF-20241215-0003",
    orderSource: "direct",
    userId: "user123",
    productId: "product456",
    product: {
      name: "Classic Denim Jeans",
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ],
      variant: {
        variantName: "Size",
        variantTypes: [
          { name: "30", price: 1999, stock: 5 },
          { name: "32", price: 1999, stock: 8 },
          { name: "34", price: 2099, stock: 12 },
        ],
      },
      discount: 15,
    },
    selectedVariant: 2,
    quantity: 1,
    originalPrice: 2099,
    discount: 15,
    finalPrice: 1784.15,
    status: "delivered",
    payment: {
      method: "card",
      status: "completed",
      transactionId: "txn_789012",
    },
    shipping: {
      trackingId: "SHIP789012",
      partner: "FedEx",
      expectedDeliveryDate: "2024-12-18",
      actualDeliveryDate: "2024-12-17",
    },
    createdAt: "2024-12-15T09:15:00Z",
  },
  {
    orderId: "INF-20241214-0002",
    orderSource: "cart",
    userId: "user123",
    productId: "product789",
    product: {
      name: "Running Shoes",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      ],
      variant: {
        variantName: "Size",
        variantTypes: [
          { name: "UK 7", price: 3999, stock: 3 },
          { name: "UK 8", price: 3999, stock: 6 },
          { name: "UK 9", price: 4199, stock: 4 },
        ],
      },
      discount: 20,
    },
    selectedVariant: 0,
    quantity: 1,
    originalPrice: 3999,
    discount: 20,
    finalPrice: 3199.2,
    status: "cancelled",
    payment: {
      method: "COD",
      status: "cancelled",
    },
    shipping: {
      partner: "DTDC",
      expectedDeliveryDate: "2024-12-19",
    },
    createdAt: "2024-12-14T16:45:00Z",
  },
];

export default function OrderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <div className="flex items-center gap-4">
            <select
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              defaultValue="all"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              defaultValue="recent"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="high">Price: High to Low</option>
              <option value="low">Price: Low to High</option>
            </select>
          </div>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
