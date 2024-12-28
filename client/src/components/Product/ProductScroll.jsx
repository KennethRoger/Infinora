import React from "react";
import ProductCard from "./ProductCard";
import ButtonClassic from "../Buttons/ButtonClassic";

const ProductScroll = ({ products, title }) => {
  // Take only first 10 products
  const limitedProducts = products.slice(0, 10);

  return (
    <div className="w-full">
      {title && (
        <div className="flex justify-between items-center px-5 pb-5">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <ButtonClassic>View More</ButtonClassic>
        </div>
      )}
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto smooth-scroll snap-x py-3 mx-5">
          {limitedProducts.map((product, i) => (
            <div key={product._id || i} className="snap-start shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductScroll;
