import CreatorBanner from "@/components/Section/CreatorBanner";
import ButtonClassic from "@/components/Buttons/ButtonClassic";
import ProductScroll from "../../../components/Product/ProductScroll";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/redux/features/allProductsSlice";
import ProductCard from "@/components/Product/ProductCard";
import CraftIdeaSection from "@/components/Section/CraftIdeaSection";

function MainPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.allProducts
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <>
      <main className="pt-[75px]">
        <CreatorBanner />
        <div className="my-10">
          <ProductScroll 
            products={products} 
            title="Popular Products" 
          />
        </div>
        <div className="mt-10">
          <CraftIdeaSection />
        </div>
        <div className="my-10">
          <ProductScroll 
            products={products} 
            title="Latest Arrivals" 
          />
        </div>
        <div className="my-10">
          <ProductScroll 
            products={products} 
            title="Top Creators" 
          />
        </div>
      </main>
    </>
  );
}

export default MainPage;
