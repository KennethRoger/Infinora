import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProductById } from "@/redux/features/singleProductSlice";
import { fetchVendorProducts } from "@/redux/features/vendorProductsSlice";
import Spinner from "@/components/Spinner/Spinner";
import ProductCard from "./ProductCard";
import MagnifyImage from "../Image/MagnifyImage";

const ProductViewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.singleProduct
  );
  const { products: vendorProducts, loading: vendorProductsLoading } =
    useSelector((state) => state.vendorProducts);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.vendor?._id) {
      dispatch(fetchVendorProducts());
    }
  }, [dispatch, product?.vendor?._id]);

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const otherVendorProducts =
    vendorProducts?.filter((p) => p._id !== productId) || [];

  const reviews = [
    {
      id: 1,
      author: "Thorin Ironfist",
      rating: 3.9,
      comment:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excellent quality!",
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  if (!product) return <div className="text-center p-4">Product not found</div>;

  return (
    <div className="pt-[75px]">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
              <MagnifyImage src={product.images[selectedImage]} alt={product.name}/>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={product.vendor?.profileImagePath} />
                  <AvatarFallback>{product.vendor?.name[0]}</AvatarFallback>
                </Avatar>
                <span>{product.vendor?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-gray-500">
                  ({product.reviews?.length || 0} Reviews)
                </span>
                <span className="text-green-500">{product.status}</span>
              </div>
              <div className="text-2xl font-bold">
                ₹{((product.price * (100 - product.discount)) / 100).toFixed(2)}
              </div>
              {product.discount > 0 && (
                <div className="flex space-x-2 text-sm">
                  <s className="text-gray-600">₹{product.price}</s>
                  <span className="text-green-600">
                    {product.discount}% off
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Size:</label>
                <div className="flex space-x-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md ${
                        selectedSize === size
                          ? "bg-orange-500 text-white"
                          : "border border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Add to Cart
                </button>

                <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Heart className="h-6 w-6" />
                </button>
              </div>

              <button className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.author}</span>
                  <div className="flex items-center space-x-1">
                    <span>gives</span>
                    <span className="font-semibold">{review.rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-md ${
                  page === 3
                    ? "bg-orange-500 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {otherVendorProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">
              More from the creator {product.vendor.name}
            </h2>
            {vendorProductsLoading ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {otherVendorProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductViewPage;
