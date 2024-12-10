import CreatorBanner from "@/components/Section/CreatorBanner";
import ButtonClassic from "@/components/Buttons/ButtonClassic";
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
          <div className="flex justify-between pb-5">
            <h1 className="text-4xl font-semibold">Popular products</h1>
            <ButtonClassic>View More</ButtonClassic>
          </div>
          <div className="flex space-x-4 overflow-x-scroll whitespace-nowrap py-3 no-scrollbar w-full">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </div>
        <div className="mt-10">
          <CraftIdeaSection />
        </div>
        <div className="my-10">
          <div className="flex justify-between pb-5">
            <h1 className="text-4xl font-semibold">Latest Arrivals</h1>
            <ButtonClassic>View More</ButtonClassic>
          </div>
          <div className="flex space-x-4 overflow-x-scroll whitespace-nowrap py-3 no-scrollbar w-full">
            {products.map((product, i) => (
              <ProductCard key={i} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default MainPage;
