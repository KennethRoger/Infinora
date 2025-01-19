import CreatorBanner from "@/components/Section/CreatorBanner";
import ProductScroll from "../../../components/Product/ProductScroll";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "@/redux/features/allProductsSlice";
import CraftIdeaSection from "@/components/Section/CraftIdeaSection";

function MainPage() {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.allProducts
  );

  useEffect(() => {
    dispatch(fetchAllProducts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const renderProductSection = (title) => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 text-center h-40 flex items-center justify-center">
          Error loading products. Please try again later.
        </div>
      );
    }

    if (!products?.length) {
      return (
        <div className="text-gray-500 text-center h-40 flex items-center justify-center">
          No products available.
        </div>
      );
    }

    return (
      <ProductScroll 
        products={products || []} 
        title={title}
      />
    );
  };

  return (
    <>
      <main className="pt-[75px]">
        <CreatorBanner />
        <div className="my-10">
          {renderProductSection("Popular Products")}
        </div>
        <div className="mt-10">
          <CraftIdeaSection />
        </div>
        <div className="my-10">
          {renderProductSection("Latest Arrivals")}
        </div>
        <div className="my-10">
          {renderProductSection("Top Creators")}
        </div>
      </main>
    </>
  );
}

export default MainPage;
