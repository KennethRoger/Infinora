import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProductById } from "@/redux/features/singleProductSlice";
import { getVendorProducts } from "@/api/vendor/vendorProduct";
import { addToCart } from "@/api/cart/cartApi";
import { getProductReviewStats } from "@/api/review/reviewApi";
import Spinner from "@/components/Spinner/Spinner";
import ProductCard from "./ProductCard";
import MagnifyImage from "../Image/MagnifyImage";
import toast from "react-hot-toast";
import StarRating from "../Rating/StarRating";
import ReviewSection from "../Review/ReviewSection";
import { toggleProductFavorite } from "@/redux/features/userFavoriteSlice";

const ProductViewPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.singleProduct
  );
  console.log(product);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorProductsLoading, setVendorProductsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });

  const { items: favorites, loading: favoritesLoading } = useSelector(
    (state) => state.favorites
  );

  const isFavorited = favorites.some(
    (favorite) => favorite.productId._id === product?._id
  );

  const handleFavoriteClick = () => {
    dispatch(toggleProductFavorite(product._id));
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentCombination, setCurrentCombination] = useState(null);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      fetchReviewStats();
    }
  }, [dispatch, productId]);

  const fetchReviewStats = async () => {
    try {
      const stats = await getProductReviewStats(productId);
      setReviewStats(stats);
    } catch (error) {
      console.error("Error fetching review stats:", error);
    }
  };

  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (product?.vendor?._id) {
        try {
          setVendorProductsLoading(true);
          const response = await getVendorProducts(product.vendor._id);
          const otherProducts = response.products.filter(
            (p) => p._id !== product._id
          );
          setVendorProducts(otherProducts);
        } catch (error) {
          console.error("Error fetching vendor products:", error);
        } finally {
          setVendorProductsLoading(false);
        }
      }
    };

    fetchVendorProducts();
  }, [product]);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price);
      if (product.variants?.length > 0) {
        const initialVariants = {};
        product.variants.forEach((variant) => {
          initialVariants[variant.variantName] = "";
        });
        setSelectedVariants(initialVariants);
      }
    }
  }, [product]);

  const handleVariantChange = (variantName, value) => {
    const updatedSelections = { ...selectedVariants, [variantName]: value };
    setSelectedVariants(updatedSelections);

    const variant = product.variants.find((v) => v.variantName === variantName);
    const selectedType = variant?.variantTypes.find(
      (type) => type.name === value
    );

    if (
      selectedType?.imageIndex !== undefined &&
      selectedType.imageIndex !== null
    ) {
      setSelectedImage(selectedType.imageIndex);
    }

    const matchingCombination = product.variantCombinations.find((combo) => {
      return Object.entries(updatedSelections).every(
        ([key, val]) => val && combo.variants[key] === val
      );
    });

    if (matchingCombination) {
      setCurrentCombination(matchingCombination);
      setTotalPrice(product.price + (matchingCombination.priceAdjustment || 0));
    } else {
      setCurrentCombination(null);
      setTotalPrice(product.price);
    }
  };

  const handleAddToCart = async () => {
    try {
      if (product.variants?.length > 0) {
        const allVariantsSelected = Object.values(selectedVariants).every(
          (value) => value
        );

        if (!allVariantsSelected) {
          toast.error("Please select all variants");
          return;
        }

        if (!currentCombination) {
          toast.error("This combination is not available");
          return;
        }

        if (currentCombination.stock <= 0) {
          toast.error("This combination is out of stock");
          return;
        }

        await addToCart({
          productId: product._id,
          quantity: 1,
          variants: selectedVariants,
          price: totalPrice,
        });
      } else {
        if (product.stock <= 0) {
          toast.error("Product is out of stock");
          return;
        }

        await addToCart({
          productId: product._id,
          quantity: 1,
          price: totalPrice,
        });
      }

      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response.data.message || "Failed to add product to cart"
      );
    }
  };

  if (loading || vendorProductsLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  if (error)
    return <div className="text-center p-4">Error loading product</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  const finalPrice = totalPrice * (1 - (product?.discount || 0) / 100);

  return (
    <div className="pt-[75px]">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
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
              <button
                onClick={handleFavoriteClick}
                disabled={favoritesLoading}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorited ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <StarRating rating={reviewStats.averageRating} />
                  <span className="text-sm text-gray-500 ml-2">
                    ({reviewStats.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div>
              {product.variants?.length > 0 ? (
                Object.values(selectedVariants).every((value) => value) ? (
                  currentCombination ? (
                    <div
                      className={`text-sm ${
                        currentCombination.stock > 10
                          ? "text-green-600"
                          : currentCombination.stock > 5
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      {currentCombination.stock === 0
                        ? "Out of stock"
                        : currentCombination.stock <= 5
                        ? `Only ${currentCombination.stock} left in stock!`
                        : currentCombination.stock <= 10
                        ? `Low in stock, ${currentCombination.stock} left`
                        : `In stock: ${currentCombination.stock}`}
                    </div>
                  ) : (
                    <div className="text-sm text-red-600">
                      This combination is not available
                    </div>
                  )
                ) : (
                  <div className="text-sm text-gray-500">
                    Select all variants to check availability
                  </div>
                )
              ) : (
                <div
                  className={`text-sm ${
                    product.stock > 10
                      ? "text-green-600"
                      : product.stock > 5
                      ? "text-yellow-500"
                      : "text-red-600"
                  }`}
                >
                  {product.stock === 0
                    ? "Out of stock"
                    : product.stock <= 5
                    ? `Only ${product.stock} left in stock!`
                    : product.stock <= 10
                    ? `Low in stock, ${product.stock} left`
                    : `In stock: ${product.stock}`}
                </div>
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

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {product.description}
              </p>
            </div>

            {product.variants?.length > 0 &&
              product.variants.map((variant) => (
                <div key={variant._id}>
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
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

            <div className="flex gap-4">
              {/* <button
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={() => {
                  // Buy now functionality
                }}
                disabled={
                  (product.variants?.length > 0 &&
                    (!currentCombination || currentCombination.stock <= 0)) ||
                  (!product.variants?.length && product.stock <= 0)
                }
              >
                Buy it now
              </button> */}
              <button
                className="flex-1 border border-orange-500 text-orange-500 py-3 rounded-lg hover:bg-orange-50 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={
                  (product.variants?.length > 0 &&
                    (!currentCombination || currentCombination.stock <= 0)) ||
                  (!product.variants?.length && product.stock <= 0)
                }
              >
                Add to cart
              </button>
            </div>

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
                  {product.customizable ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection productId={productId} />

        {vendorProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">
              More from this Vendor
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendorProducts.slice(0, 4).map((product) => (
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
