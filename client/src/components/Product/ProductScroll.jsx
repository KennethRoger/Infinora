import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ButtonClassic from "../Buttons/ButtonClassic";

const ProductScroll = ({ products, title, type = "all" }) => {
  const navigate = useNavigate();
  const limitedProducts = products.slice(0, 10);

  const handleViewMore = () => {
    navigate("/home/products", { 
      state: { 
        products,
        type,
        title 
      } 
    });
  };

  return (
    <div className="w-[98%] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <ButtonClassic onClick={handleViewMore}>View More</ButtonClassic>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {limitedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductScroll;