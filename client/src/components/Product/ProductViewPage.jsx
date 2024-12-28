import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProductById } from "@/redux/features/singleProductSlice";
import { fetchVendorProducts } from "@/redux/features/vendorProductsSlice";
import { addToCart } from "@/api/cart/cartApi";
import Spinner from "@/components/Spinner/Spinner";
import ProductCard from "./ProductCard";
import MagnifyImage from "../Image/MagnifyImage";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const ProductViewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.singleProduct
  );
  const { products: vendorProducts, loading: vendorProductsLoading } =
    useSelector((state) => state.vendorProducts);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

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

  useEffect(() => {
    if (product?.productVariants?.length > 0) {
      let initialTotal = 0;
      product.productVariants.forEach((variant) => {
        if (variant.variantTypes.length > 0) {
          initialTotal += variant.variantTypes[0].price;
        }
      });
      setTotalPrice(initialTotal);
    } else if (product?.price) {
      setTotalPrice(product.price);
    }
  }, [product]);

  const handleVariantChange = (variantName, typeName) => {
    const updatedSelections = { ...selectedVariants, [variantName]: typeName };
    setSelectedVariants(updatedSelections);

    const variant = product.productVariants.find(
      (v) => v.variantName === variantName
    );
    const selectedType = variant?.variantTypes.find(
      (type) => type.name === typeName
    );

    if (
      selectedType?.imageIndex !== undefined &&
      selectedType.imageIndex !== null
    ) {
      setSelectedImage(selectedType.imageIndex);
    }

    const newTotal = product.productVariants.reduce((total, variant) => {
      const selectedType = variant.variantTypes.find(
        (type) => type.name === updatedSelections[variant.variantName]
      );
      return total + (selectedType?.price || 0);
    }, 0);

    setTotalPrice(newTotal);
  };

  const otherVendorProducts =
    vendorProducts?.filter((p) => p._id !== productId) || [];

  const handleAddToCart = async () => {
    try {
      if (product.productVariants?.length > 0) {

        const allVariantsSelected = product.productVariants.every(
          (variant) => selectedVariants[variant.variantName]
        );

        if (!allVariantsSelected) {
          toast.error("Please select all variants");
          return;
        }

        const hasLowStock = product.productVariants.some((variant) => {
          const selectedType = variant.variantTypes.find(
            (type) => type.name === selectedVariants[variant.variantName]
          );
          return selectedType?.stock < 1;
        });

        if (hasLowStock) {
          toast.error("Some selected variants are out of stock");
          return;
        }

        const cartData = {
          productId: product._id,
          selectedVariants: Object.entries(selectedVariants).map(
            ([variantName, typeName]) => ({
              variantName,
              typeName,
            })
          ),
          quantity: 1,
        };
        await addToCart(cartData);
      } else {
        // Handle non-variant product
        if (product.stock < 1) {
          toast.error("Product is out of stock");
          return;
        }

        const cartData = {
          productId: product._id,
          quantity: 1,
        };
        await addToCart(cartData);
      }

      toast.success("Product added to cart successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  };

  const finalPrice = totalPrice * (1 - (product?.discount || 0) / 100);

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left side - Image gallery */}
          <div className="md:col-span-1 flex md:flex-col gap-2 order-2 md:order-1">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-orange-500"
                    : "border-transparent hover:border-gray-200"
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

          <div className="md:col-span-6 order-1 md:order-2">
            <div className="aspect-square rounded-lg overflow-hidden">
              <MagnifyImage
                src={product.images[selectedImage]}
                alt={product.name}
              />
            </div>
          </div>

          <div className="md:col-span-5 space-y-6 order-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={product.vendor?.profileImagePath} />
                  <AvatarFallback>{product.vendor?.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{product.vendor?.name}</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="h-6 w-6" />
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1">{product.rating}</span>
                </div>
                <span className="text-gray-500">
                  ({product.reviews?.length || 0} Reviews)
                </span>
                {product.salesCount > 0 && (
                  <span className="text-gray-500">
                    {product.salesCount} sold
                  </span>
                )}
              </div>
            </div>

            {/* Price and Stock */}
            <div>
              {product.productVariants?.length > 0 ? (
                // Show stock for variant products
                product.productVariants?.some((variant) => {
                  const selectedType = variant.variantTypes.find(
                    (type) => type.name === selectedVariants[variant.variantName]
                  );
                  return selectedType && selectedType.stock <= 10;
                }) && (
                  <div className="text-red-500 text-sm mb-1">
                    Low in stock, only{" "}
                    {product.productVariants
                      ?.map((variant) => {
                        const selectedType = variant.variantTypes.find(
                          (type) => type.name === selectedVariants[variant.variantName]
                        );
                        return selectedType?.stock;
                      })
                      .filter((stock) => stock !== undefined)
                      .sort((a, b) => a - b)[0]}{" "}
                    left
                  </div>
                )
              ) : (
                // Show stock for non-variant products
                product.stock <= 10 && (
                  <div className="text-red-500 text-sm mb-1">
                    Low in stock, only {product.stock} left
                  </div>
                )
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold">
                  ₹{finalPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <>
                    <span className="text-gray-500 line-through">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                    <span className="text-green-600">
                      {product.discount}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            {product.productVariants?.length > 0 &&
              product.productVariants?.map((variant) => (
                <div key={variant._id} className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variant.variantName}
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedVariants[variant.variantName] || ""}
                      onChange={(e) =>
                        handleVariantChange(variant.variantName, e.target.value)
                      }
                    >
                      <option value="">Select {variant.variantName}</option>
                      {variant.variantTypes.map((type) => (
                        <option key={type._id} value={type.name}>
                          {type.name} {type.price > 0 && `(₹${type.price})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
                onClick={() => {
                  // Buy now functionality
                }}
              >
                Buy it now
              </button>
              <button
                className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add to cart"}
              </button>
            </div>

            {/* Additional Details */}
            {product.additionalDetails && (
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Additional Details</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="whitespace-pre-wrap">
                    {product.additionalDetails}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Category:</span>
                <div className="font-medium">{product.category?.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Subcategory:</span>
                <div className="font-medium">{product.subCategory?.name}</div>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <div className="font-medium capitalize">{product.status}</div>
              </div>
              <div>
                <span className="text-gray-600">Customizable:</span>
                <div className="font-medium">
                  {product.customizationOptions ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

          {/* Review Summary */}
          <div className="flex items-center justify-between mb-8 border-b pb-6">
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold">{product.rating}</div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(product.rating)
                          ? "fill-current"
                          : "fill-none"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-500">
                  Based on {product.reviews?.length || 0} reviews
                </div>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            {product.reviews?.map((review, index) => (
              <div key={index} className="border-b pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {review.userId?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {review.userId?.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-current" : "fill-none"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}

            {(!product.reviews || product.reviews.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                No reviews yet. Be the first to review this product!
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {otherVendorProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              More from this Vendor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherVendorProducts.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductViewPage;
