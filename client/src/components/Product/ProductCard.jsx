import { useDispatch } from "react-redux";
import StarRating from "../Rating/StarRating";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProductById } from "@/redux/features/singleProductSlice";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProductClick = async () => {
    try {
      window.scrollTo(0, 0);
      await dispatch(fetchProductById(product._id));
      navigate(`/home/product/${product._id}`);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <>
      <div
        className="w-[300px] border shadow-lg overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start p-2">
          <p className="text-gray-600">{product.vendor.name}</p>
          <h3 className="font-bold">{product.name}</h3>
          <StarRating rating={product.rating} />
          <div className="flex items-center gap-2">
            <p className="font-bold text-xl text-black">
              ₹
              {(
                product.variant?.variantTypes[0]?.price *
                (1 - product.discount / 100)
              ).toFixed(2)}
            </p>
            {product.discount > 0 && (
              <div className="flex gap-2 text-sm">
                <s className="text-gray-600">
                  ₹{product.variant?.variantTypes[0]?.price}
                </s>
                <p className="text-green-600">{product.discount}% off</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
